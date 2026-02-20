// Filename: Ryan_Fanning_Final_Project.cpp
// Description: A beginning OpenGL program using C++ and GLUT
// Author: Ryan Fanning
// Date Modified: 11/12/2025

#include "GLUtilities.h"
#include "Camera.h"
#include "Material.h"

//Function prototypes...
void display(void);
void resetScene();
void enableLights();
void reshape(GLsizei width, GLsizei height);
void keyboardClick(unsigned char key, GLsizei x, GLsizei y);
void specialInput(int key, GLsizei x, GLsizei y);
void mouseClick(int button, int state, GLsizei x, GLsizei y);
void mouseMotion(GLsizei x, GLsizei y);
void timer(int millisec);


// NEW FUNCTIONS
void drawText(float x, float y, const char* text); // Draw text function
bool checkCollision(float carX, float carZ, float obsX, float obsZ); // Function to check for collisions
void drawCar(GLUquadric* wheelQuadric); // Function to draw a car


//Global variables...
bool blLightsAreOn;
GLfloat rotationX, rotationY;
GLfloat prevMouseX, prevMouseY;
GLfloat locationX, locationY;
int orbitRotation;
bool blMouseLeftDown;
bool blMouseMiddleDown;
bool blMouseRightDown;

GLsizei windowWidth = 640;
GLsizei windowHeight = 480;

// NEW GLOBAL VARIABLES
GLfloat carX = 0.0f;      // current lateral position
GLfloat carSpeed = 0.4f;  // speed of sideways movement
GLfloat roadWidthGlobal = 0.0f; // will hold one road width

bool gameOver = false; // Boolean to know when game is on or over

// Struct to setup up obstacles
struct Obstacle
{
    int laneIndex;   // 0 = left, 1 = middle, 2 = right
    float zPos;      // along the road
};
const int NUM_OBSTACLES = 10;
Obstacle obstacles[NUM_OBSTACLES];  // holds all obstacles
float obstacleSpeed = 0.2f; // speed at which obstacles move toward the car

// Material Objects
Material wood;
Material ground;
Material sky;
Material obstacleMaterials[6] = { wood, wood, wood, wood, wood, wood }; // Paint obstacles
GLUquadric *q;

Camera avatarPOV;

int main(int argc, char **argv) 
{
    // Initialization functions...
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH); // Use double buffer mode and depth buffer
    glutInitWindowSize(windowWidth, windowHeight); // Set the windows initial width and height
    glutInitWindowPosition(50, 50);                // Position the windows inital top left corner

    glutCreateWindow("A beginning OpenGL program using C++ and GLUT");

    //Callback functions...
    glutDisplayFunc(&display);
    glutReshapeFunc(&reshape);
    glutKeyboardFunc(&keyboardClick);
    glutSpecialFunc(&specialInput);
    glutMouseFunc(&mouseClick);
    glutMotionFunc(&mouseMotion);
    glutTimerFunc(20, &timer, 20);

    // Load materials...
    sky.load("Textures/Sky1.png"); 
    ground.load("Textures/Road3.png");
    obstacleMaterials[0].load("Textures/Wood1.png");
    obstacleMaterials[1].load("Textures/Wood1.png");
    obstacleMaterials[2].load("Textures/Wood1.png");
    obstacleMaterials[3].load("Textures/Wood1.png");
    obstacleMaterials[4].load("Textures/Wood1.png");
    obstacleMaterials[5].load("Textures/Wood1.png");

    q = gluNewQuadric();                                  // Memory for a new quadric
    gluQuadricNormals(q, GLU_SMOOTH);                     // Generate smooth normals for the quadric
    glTexGeni(GL_S, GL_TEXTURE_GEN_MODE, GL_SPHERE_MAP);  // Setup sphere mapping
    glTexGeni(GL_T, GL_TEXTURE_GEN_MODE, GL_SPHERE_MAP);  // Setup sphere mapping

    resetScene();
    glutMainLoop();
    return 0;
}

void display(void)
{
    avatarPOV.runCamera();
    enableLights();

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_CULL_FACE);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    // Variables to create the 3 lanes
    GLfloat laneWidth  = 2.0f; 
    GLfloat roadWidth  = laneWidth * 3.0f;
    roadWidthGlobal = roadWidth;

    GLfloat roadHalf   = roadWidth / 2.0f;
    GLfloat roadHeight = -10.0f;
    GLfloat roadLength = 200.0f;
    GLfloat repeatNum  = roadLength / 5.0f;

    // Each road center position
    GLfloat roadOffsets[] = { -roadWidth, 0.0f, roadWidth };

    // Draw 3 parallel road sections
    for (int i = 0; i < 3; i++)
    {
        glPushMatrix();
        glTranslatef(roadOffsets[i], 0.0f, 0.0f);

        // Paint the roads
        ground.paintMaterial();
        // Draw the road as a single textured quad
        glBegin(GL_QUADS);
            // Top left corner (end of road)
            glTexCoord2f(0.0f, repeatNum);
            glVertex3f(-roadHalf, roadHeight,  roadLength);

            // Top right corner
            glTexCoord2f(1.0f, repeatNum);
            glVertex3f( roadHalf, roadHeight,  roadLength);

            // Bottom right corner
            glTexCoord2f(1.0f, 0.0f);
            glVertex3f( roadHalf, roadHeight, -roadLength);

            // Bottom left corner
            glTexCoord2f(0.0f, 0.0f);
            glVertex3f(-roadHalf, roadHeight, -roadLength);
        glEnd();
        ground.stopMaterial();

        glPopMatrix();
    }

    // Draw obstacles
    for(int i = 0; i < NUM_OBSTACLES; i++)
    {
        glPushMatrix();

        int lane = obstacles[i].laneIndex;

        // Road center for this obstacle
        GLfloat roadCenterX = roadOffsets[lane];

        // Correct lane center: -laneWidth, 0, +laneWidth
        GLfloat laneCenterX = roadCenterX + (lane - 1) * laneWidth;

        // Position the obstacles on the screen slightly above road
        glTranslatef(laneCenterX - 1.0f, roadHeight + 0.5f, obstacles[i].zPos);

        float cubeSize = 1.0f;

        // Draw 3 cubes horizontally
        for (int j = 0; j < 3; j++)
        {
            glPushMatrix();
            glTranslatef(j * cubeSize, 0.0f, 0.0f);
            drawTexturedCube(obstacleMaterials, cubeSize);
            glPopMatrix();
        }

        glPopMatrix();
    }

    // Draw the car
    glPushMatrix();
    glTranslatef(carX, roadHeight + 1.0f, 0.0f);
    glRotatef(90.0f, 0.0f, 1.0f, 0.0f);
    drawCar(q);
    glPopMatrix();

    // Draw the sky
    glPushMatrix();

    GLfloat skyRadius = 800.0f; // Make sure the skyradius is big enough 

    glRotatef(-90.0f, 1.0f, 0.0f, 0.0f);
    gluQuadricOrientation(q, GLU_INSIDE);
    gluQuadricTexture(q, GL_TRUE);

    // Paint
    sky.paintMaterial();
    gluSphere(q, skyRadius, 40, 40);
    sky.stopMaterial();

    gluQuadricTexture(q, GL_FALSE);

    glPopMatrix();

    // Displays Game Over in the middle of the Screen
    if (gameOver)
    {
        drawText(windowWidth / 2 - 60, windowHeight / 2, "GAME OVER");
    }

    // Text in the top left corner for controls
    drawText(10, windowHeight - 20, "To move the car press a/d or left and right arrow keys to move Left & Right respectively");
    drawText(10, windowHeight - 40, "To move Left & Right respectively, Press ESC to Exit");
    drawText(10, windowHeight - 60, "If the car hits an obstacle the game is over");


    glutSwapBuffers();
}


void resetScene()
{
    avatarPOV.setLocation(0.0f, -8.0f, -15.0f);
    avatarPOV.setRotation(0.0f, 0.0f, 1.0f);
    blLightsAreOn = false;
    rotationX = 0.0f;
    rotationY = 0.0f;
    prevMouseX = 0.0f;
    prevMouseY = 0.0f;
    locationX = 0.0f;
    locationY = 0.0f;
    orbitRotation = 0;

    blMouseLeftDown = false;
    blMouseMiddleDown = false;
    blMouseRightDown = false;

    glClearDepth(1.0f);                    
    glEnable(GL_DEPTH_TEST);               
    glDepthFunc(GL_LEQUAL);                
    glShadeModel(GL_SMOOTH);               
    glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST); 
    glFrontFace(GL_CCW);                              

    // Initialize obstacles
    for (int i = 0; i < NUM_OBSTACLES; i++)
    {
        obstacles[i].laneIndex = rand() % 3; // Put obstacle on random lane           
        obstacles[i].zPos = (float)(rand() % 200 + 20); // Make sure obstacles are in front
    }


    reshape(windowWidth, windowHeight);
    glutPostRedisplay();
}

void enableLights()
{
    if(blLightsAreOn)
    {
        glEnable(GL_LIGHTING);
        glEnable(GL_COLOR_MATERIAL);

        GLfloat lightsKa[] = {0.3f, 0.3f, 0.3f, 1.0f}; 
        GLfloat lightsKd[] = {0.7f, 0.7f, 0.7f, 1.0f}; 
        GLfloat lightsKs[] = {0.9f, 0.9f, 0.9f, 1.0f}; 

        glLightfv(GL_LIGHT0, GL_AMBIENT, lightsKa);
        glLightfv(GL_LIGHT0, GL_DIFFUSE, lightsKd);
        glLightfv(GL_LIGHT0, GL_SPECULAR, lightsKs);

        GLfloat lightPosition[] = {0.0f, 0.0f, 0.0f, 1.0f}; 
        glLightfv(GL_LIGHT0, GL_POSITION, lightPosition);
        glEnable(GL_LIGHT0);
    }
    else
    {
        glDisable(GL_LIGHTING);
    }
}

void reshape(GLsizei width, GLsizei height)
{
    if(height <= 0) height = 1;       
    if(width <= 0) width = 1;         

    windowWidth = width;
    windowHeight = height;

    avatarPOV.setupCamera(CAM_PROJ_PERSPECTIVE, width, height, 45.0f, 0.01f, 2000.0f);
    glViewport(0, 0, width, height);
    glutPostRedisplay();
}

void keyboardClick(unsigned char key, GLsizei x, GLsizei y)
{
    switch (key)
    {
        case 'q': case 'Q': case 27:
            exit(EXIT_SUCCESS);
            break;
        case 'L':
            blLightsAreOn = !blLightsAreOn;
            break;
        case 'r': case 'R':
            resetScene();
            break;
        case 'a':   // move car left
            carX += carSpeed;
            if (carX > roadWidthGlobal) carX = roadWidthGlobal;
            break;
        case 'd':   // move car right
            carX -= carSpeed;
            if (carX < -roadWidthGlobal) carX = -roadWidthGlobal;
            break;
    }
    glutPostRedisplay();
}

void specialInput(int key, GLsizei x, GLsizei y)
{
    switch(key)
    {
        // Move car left
        case GLUT_KEY_LEFT:          
        carX += carSpeed;
        if (carX > roadWidthGlobal) carX = roadWidthGlobal;
        break;        
        // Move car right
        case GLUT_KEY_RIGHT:             
        carX -= carSpeed;
        if (carX < -roadWidthGlobal) carX = -roadWidthGlobal;
        break;
    }
    glutPostRedisplay();
}

void mouseClick(int button, int state, GLsizei x, GLsizei y)
{
    if(button == GLUT_LEFT_BUTTON) blMouseLeftDown = (state == GLUT_DOWN);
    if(button == GLUT_MIDDLE_BUTTON) blMouseMiddleDown = (state == GLUT_DOWN);
    if(button == GLUT_RIGHT_BUTTON) blMouseRightDown = (state == GLUT_DOWN);
    prevMouseX = x;
    prevMouseY = y;
}

void mouseMotion(GLsizei x, GLsizei y)
{
    if(blMouseLeftDown)
    {
        if(x > prevMouseX) avatarPOV.turnRight(0.2f);
        if(x < prevMouseX) avatarPOV.turnLeft(0.2f);
        if(y > prevMouseY) avatarPOV.lookUp(0.2f);
        if(y < prevMouseY) avatarPOV.lookDown(0.2f);
        rotationX += x - prevMouseX;
        rotationY += y - prevMouseY;
    }
    if(blMouseRightDown)
    {
        if(x > prevMouseX) avatarPOV.strafeRight(0.3f);
        if(x < prevMouseX) avatarPOV.strafeLeft(0.3f);
        if(x > prevMouseX) avatarPOV.moveForward(0.3f);
        if(x < prevMouseX) avatarPOV.moveBackward(0.3f);
        locationX += 10.0f * (x - prevMouseX) / windowWidth;
        locationY -= 10.0f * (y - prevMouseY) / windowHeight;
    }

    prevMouseX = x;
    prevMouseY = y;
    glutPostRedisplay();
}

// NEW FUNCTIONS BELOW

// Function to draw text to screen
void drawText(float x, float y, const char* text)
{
    // Switch to projection mode for 2D drawing
    glMatrixMode(GL_PROJECTION);
    glPushMatrix();
    glLoadIdentity();
    gluOrtho2D(0, windowWidth, 0, windowHeight);

    // Reset modelview
    glMatrixMode(GL_MODELVIEW);
    glPushMatrix();
    glLoadIdentity();

    glDisable(GL_LIGHTING);

    glColor3f(1.0f, 0.0f, 0.0f); // red text
    glRasterPos2f(x, y);

    // Draw the character
    for (int i = 0; text[i] != '\0'; i = i + 1) {
        glutBitmapCharacter(GLUT_BITMAP_HELVETICA_18, text[i]);
    }
    glEnable(GL_LIGHTING);

    // Restore prev matrices
    glPopMatrix();
    glMatrixMode(GL_PROJECTION);
    glPopMatrix();
    glMatrixMode(GL_MODELVIEW);
}

// Function to check for collision
bool checkCollision(float carX, float carZ, float obsX, float obsZ)
{
    // Half dimensions for box collision
    float carHalfWidth = 1.0f;
    float carHalfLength = 1.0f;

    float obsHalfWidth = 1.5f;
    float obsHalfLength = 1.0f;

    // Check for overlap on X and Y 
    bool overlapX = fabs(carX - obsX) < (carHalfWidth + obsHalfWidth);
    bool overlapZ = fabs(carZ - obsZ) < (carHalfLength + obsHalfLength);

    // If overlap then collision occurs
    return overlapX && overlapZ;
}



void timer(int millisec)
{
    orbitRotation++;
    if (orbitRotation >= 360) orbitRotation = 0;

    float carZ = 0.0f;

    if (!gameOver)
    {
        for (int i = 0; i < NUM_OBSTACLES; i++)
        {
            obstacles[i].zPos -= obstacleSpeed;

            // Lane + road parameters
            float laneWidth = roadWidthGlobal / 3.0f;
            float roadWidth = roadWidthGlobal;
            float roadOffsets[] = { -roadWidth, 0.0f, roadWidth };

            int lane = obstacles[i].laneIndex;

            // Correct lane center
            float roadCenterX = roadOffsets[lane];
            float laneCenterX = roadCenterX + (lane - 1) * laneWidth;

            // Center of 3-cube obstacle 
            float obstacleCenterX = laneCenterX + 1.0f;

            // If car collides with obstacle -> Game Over
            if (checkCollision(carX, carZ, obstacleCenterX, obstacles[i].zPos))
            {
                gameOver = true;
            }

            // Respawn obstacles
            if (obstacles[i].zPos < -5.0f)
            {
                obstacles[i].zPos = (float)(rand() % 200 + 20);
                obstacles[i].laneIndex = rand() % 3;
            }
        }
    }

    glutPostRedisplay();
    glutTimerFunc(millisec, &timer, millisec);
}

// Function to draw a simple red car using cubes and spheres
void drawCar(GLUquadric* wheelQuadric)
{
    // Draw the car body
    glPushMatrix();
    glColor3f(1.0f, 0.0f, 0.0f);  
    glScalef(2.0f, 0.5f, 1.0f);    
    glutSolidCube(1.0f);
    glPopMatrix();

    // Draw the car roof
    glPushMatrix();
    glColor3f(1.0f, 0.0f, 0.0f);  
    glTranslatef(0.0f, 0.5f, 0.0f); 
    glScalef(1.0f, 0.3f, 0.8f);     
    glutSolidCube(1.0f);
    glPopMatrix();

    // Draw the cars wheels
    float wheelRadius = 0.25f;
    float bodyLength = 2.0f;
    float bodyWidth = 1.0f;
    float bodyHeight = 0.5f;

    float wheelXOffset = bodyLength / 2 - wheelRadius;
    float wheelZOffset = bodyWidth / 2 + 0.05f;
    float wheelYOffset = -bodyHeight / 2 - wheelRadius;

    glColor3f(0.0f, 0.0f, 0.0f); 

    glPushMatrix();
    glTranslatef(-wheelXOffset, wheelYOffset, wheelZOffset);
    glRotatef(90.0f, 0.0f, 1.0f, 0.0f);
    gluSphere(wheelQuadric, wheelRadius, 16, 16);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(-wheelXOffset, wheelYOffset, -wheelZOffset);
    glRotatef(90.0f, 0.0f, 1.0f, 0.0f);
    gluSphere(wheelQuadric, wheelRadius, 16, 16);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(wheelXOffset, wheelYOffset, wheelZOffset);
    glRotatef(90.0f, 0.0f, 1.0f, 0.0f);
    gluSphere(wheelQuadric, wheelRadius, 16, 16);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(wheelXOffset, wheelYOffset, -wheelZOffset);
    glRotatef(90.0f, 0.0f, 1.0f, 0.0f);
    gluSphere(wheelQuadric, wheelRadius, 16, 16);
    glPopMatrix();
}
