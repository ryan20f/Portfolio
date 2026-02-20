// Filename: GLUtilities.cpp
// Description: Moving the Camera!
// Author: Ryan Fanning
// Date Modified: 10/16/2025

#include "GLUtilities.h"

void drawTexturedCube(Material materials[], float w)
{
    w = w * 0.5f;
    GLfloat vertices[8][3] = {
        { w,  w,  w}, // v0
        {-w,  w,  w}, // v1
        {-w, -w,  w}, // v2
        { w, -w,  w}, // v3
        { w, -w, -w}, // v4
        { w,  w, -w}, // v5
        {-w,  w, -w}, // v6
        {-w, -w, -w}  // v7

    };

    static int faces[6][4] = { {0, 1, 2, 3}, // front face
                               {0, 3, 4, 5}, // Right Face
                               {0, 5, 6, 1}, // Up Face
                               {4, 7, 6, 5}, // Back Face
                               {1, 6, 7, 2}, // Left Face
                               {2, 7, 4, 3}}; // Bottom Face

    for(int f = 0; f < 6; f++)
    {
        glPushMatrix();
        materials[f].paintMaterial();
        glBegin(GL_QUADS);           //  X                      // Y                     //  Z
        glTexCoord2f(1.0f, 1.0f);
        glVertex3f(vertices[faces[f][0]][0], vertices[faces[f][0]][1], vertices[faces[f][0]][2]);
        glTexCoord2f(0.0f, 1.0f);
        glVertex3f(vertices[faces[f][1]][0], vertices[faces[f][1]][1], vertices[faces[f][1]][2]);
        glTexCoord2f(0.0f, 0.0f);
        glVertex3f(vertices[faces[f][2]][0], vertices[faces[f][2]][1], vertices[faces[f][2]][2]);
        glTexCoord2f(1.0f, 0.0f);
        glVertex3f(vertices[faces[f][3]][0], vertices[faces[f][3]][1], vertices[faces[f][3]][2]);
        glEnd();
        materials[f].stopMaterial();
        glPopMatrix();
    }
}


void drawBitmapText(char *text, void *font, GLfloat x, GLfloat y)
{
    // GLUT_BITMAP_8_BY_13
    // GLUT_BITMAP_8_BY_13
    // GLUT_BITMAP_TIMES_ROMAN_10
    // GLUT_BITMAP_TIMES_ROMAN_24
    // GLUT_BITMAP_HELVETICA_10
    // GLUT_BITMAP_HELVETICA_12
    // GLUT_BITMAP_HELVETICA_18

    glPushMatrix();
    glRasterPos2f(x, y);
    char *c;
    for(c = text; *c; c++)
    {
        glutBitmapCharacter(font, *c);
    }

    glPopMatrix();
}


int getBitmapTextWidth(char *text, void *font)
{
    glPushMatrix();
    int w = 0;
    char *c;
    for(c = text; *c; c++)
    {
        w += glutBitmapWidth(font, *c);
    }

    glPopMatrix();
    return w;    
}

void drawStrokeText(char *text, void *font, GLfloat x, GLfloat y, GLfloat z)
{
    glPushMatrix();
    glRasterPos2f(x, y);
    char *c;
    for(c = text; *c; c++)
    {
        glColor3f(rand()/(GLfloat) RAND_MAX, rand()/(GLfloat) RAND_MAX, rand()/(GLfloat) RAND_MAX);
        glutStrokeCharacter(font, *c);
    }

    glPopMatrix();
}

int getStrokeTextWidth(char *text, void *font)
{
    glPushMatrix();
    int w = 0;
    char *c;
    for(c = text; *c; c++)
    {
        w += glutStrokeWidth(font, *c);
    }

    glPopMatrix();
    return w; 
}


void drawCube()
{
   
    glBegin(GL_QUADS);
    // Front face (z = 1.0f)
    glColor3f(0.9f, 0.1f, 0.1f);
    glVertex3f( 1.0f,  1.0f,  1.0f);    // A
    glVertex3f(-1.0f,  1.0f,  1.0f);    // B
    glVertex3f(-1.0f, -1.0f,  1.0f);    // C
    glVertex3f( 1.0f, -1.0f,  1.0f);    // D
    glEnd();
    

    glBegin(GL_QUADS);
    // Right face (x = 1.0f)
    glColor3f(0.1f, 0.9f, 0.1f);
    glVertex3f( 1.0f,  1.0f,  1.0f);    // A
    glVertex3f( 1.0f, -1.0f,  1.0f);    // D
    glVertex3f( 1.0f, -1.0f, -1.0f);    // H
    glVertex3f( 1.0f,  1.0f, -1.0f);    // E
    glEnd();

    glBegin(GL_QUADS);
    // Left face (x = -1.0f)
    glColor3f(0.1f, 0.1f, 0.9f);
    glVertex3f(-1.0f,  1.0f,  1.0f);    // B
    glVertex3f(-1.0f,  1.0f, -1.0f);    // F
    glVertex3f(-1.0f, -1.0f, -1.0f);    // G
    glVertex3f(-1.0f, -1.0f,  1.0f);    // C
    glEnd();

    glBegin(GL_QUADS);
    // Bottom face (y = -1.0f)
    glColor3f(0.9f, 0.9f, 0.1f);
    glVertex3f(-1.0f, -1.0f,  1.0f);    // C
    glVertex3f(-1.0f, -1.0f, -1.0f);    // G
    glVertex3f( 1.0f, -1.0f, -1.0f);    // H
    glVertex3f( 1.0f, -1.0f,  1.0f);    // D
    glEnd();

    glBegin(GL_QUADS);
    // Back face (z = -1.0f)
    glColor3f(0.1f, 0.9f, 0.9f);
    glVertex3f( 1.0f, -1.0f, -1.0f);    // H
    glVertex3f(-1.0f, -1.0f, -1.0f);    // G
    glVertex3f(-1.0f,  1.0f, -1.0f);    // F
    glVertex3f( 1.0f,  1.0f, -1.0f);    // E
    glEnd();

    glBegin(GL_QUADS);
    // Top face (y = 1.0f)
    glColor3f(0.9f, 0.1f, 0.9f);
    glVertex3f( 1.0f,  1.0f,  1.0f);    // A
    glVertex3f( 1.0f,  1.0f, -1.0f);    // E
    glVertex3f(-1.0f,  1.0f, -1.0f);    // F
    glVertex3f(-1.0f,  1.0f,  1.0f);    // B
    glEnd();
}


void drawPyramid()
{
        glBegin(GL_QUADS);
    // Bottom face (y = -1.0f)
    glColor3f(0.9f, 0.9f, 0.1f);
    glVertex3f(-1.0f, -1.0f,  1.0f);    // C
    glVertex3f(-1.0f, -1.0f, -1.0f);    // G
    glVertex3f( 1.0f, -1.0f, -1.0f);    // H
    glVertex3f( 1.0f, -1.0f,  1.0f);    // D
    glEnd();

    glBegin(GL_TRIANGLES);
    // Front face
    glColor3f(0.9f, 0.1f, 0.1f);
    glVertex3f(-1.0f, -1.0f,  1.0f);    // C
    glColor3f(0.9f, 0.8f, 0.1f);
    glVertex3f( 1.0f, -1.0f,  1.0f);    // D
    glColor3f(0.9f, 0.4f, 0.6f);
    glVertex3f( 0.0f,  1.0f,  0.0f);    // I 
    glEnd();

    glBegin(GL_TRIANGLES);
    // Left face
    glColor3f(0.9f, 0.1f, 0.5f);
    glVertex3f(-1.0f, -1.0f,  1.0f);    // C
    glColor3f(0.9f, 0.8f, 0.1f);
    glVertex3f( 0.0f,  1.0f,  0.0f);    // I 
    glColor3f(0.6f, 0.7f, 0.3f);
    glVertex3f(-1.0f, -1.0f, -1.0f);    // G
    glEnd();

    glBegin(GL_TRIANGLES);
    // Right face
    glColor3f(0.4f, 0.1f, 0.5f);
    glVertex3f( 1.0f, -1.0f,  1.0f);    // D
    glColor3f(0.9f, 0.8f, 0.6f);
    glVertex3f( 1.0f, -1.0f, -1.0f);    // H
    glColor3f(0.6f, 0.7f, 0.9f);
    glVertex3f( 0.0f,  1.0f,  0.0f);    // I 
    glEnd();

    glBegin(GL_TRIANGLES);
    // Back face
    glColor3f(0.4f, 0.9f, 0.5f);
    glVertex3f(-1.0f, -1.0f, -1.0f);    // G
    glColor3f(0.4f, 0.1f, 0.6f);
    glVertex3f( 0.0f,  1.0f,  0.0f);    // I 
    glColor3f(0.6f, 0.1f, 0.9f);
    glVertex3f( 1.0f, -1.0f, -1.0f);    // H
    glEnd();
}