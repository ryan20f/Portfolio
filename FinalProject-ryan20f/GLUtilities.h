// Filename: GLUtilities.h
// Description: Custom Utilities for OpenGL
// Author: Ryan Fanning
// Date Modified: 10/23/2025

#include "Material.h"
#pragma once
#if !defined(_GL_UTILITIES_H_)
#define _GL_UTILITIES_H_

#include <iostream>
using namespace std;

#if defined __APPLE__
    #include <GLUT/glut.h>
#elif defined _WIN32 || defined _WIN64
    #include <GL/glut.h>
#elif __llnux__
    #include <GL/freeglut.h>
#endif

#endif // _GL_UTILITIES_H_

void drawBitmapText(char *text, void *font, GLfloat x, GLfloat y);
int getBitmapTextWidth(char *text, void *font);
void drawStrokeText(char *text, void *font, GLfloat x, GLfloat y, GLfloat z);
int getStrokeTextWidth(char *text, void *font);

void drawTexturedCube(Material materials[], GLfloat w = 1.0f);
void drawCube();
void drawPyramid();