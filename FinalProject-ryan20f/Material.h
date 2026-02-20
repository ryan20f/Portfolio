//
//	Material.h
//
//
//  by: Scott McDermott
//  Date of first version :			08/16/04
//  Date of last major version:		11/13/05
//
#ifndef _MATERIAL_H_
#define _MATERIAL_H_

#include <iostream>
using namespace std;

#include "MathSettings.h"
#include <string>

#if defined __APPLE__
    #include <GLUT/glut.h>
#elif defined _WIN32 || defined _WIN64
    #include <GL\glut.h>
#elif defined __linux__
    #include <GL/freeglut.h>
#endif

class Material
{
protected:
	// Material properties of the object (color).
	real mat_amb[4];
	// Material properties of the object (diffuse reflectance).
	real mat_dif[4];
	// Material properties of the object (specular reflectance).
	real mat_spec[4];
	// Material properties of the object (specular exponent).
	real mat_spec_exp[1];

	// Material name
	string name;

	// Material file location
	string filename;

	// Represented size of image
	real sizeX;

	// Represented size of image
	real sizeY;

	// Represented size of image
	real sizeZ;

	// Is material loaded?
	bool fileIsLoaded;

public:
	// The UNIQUE internal id of the texture for binding...
	int id;

	// Setup and load the material file
	bool load(string file);

	// Is the material file loaded yet?
	inline bool isLoaded() { return fileIsLoaded; }

	Material();

	// Set the color and material properties of the object.
	void setColor(real amb0 = 0.2, real amb1 = 0.2, real amb2 = 0.2,
				  real dif0 = 0.2, real dif1 = 0.2, real dif2 = 0.2,
				  real spec0 = 0.2, real spec1 = 0.2, real spec2 = 0.2,
				  real specexp = 1.0);

	// Setup material properties to begin drawing.
	void paintMaterial();

	// Stop painting the  material
	void stopMaterial();

	// Set the name of the material.
	inline void setName(string setname) { name = setname; }

	// Return whether or not the name is the same as argument.
	inline bool isName(string checkname) { return (name == checkname); }

	// Set the actual size of the image.
	inline void setSize(real x, real y, real z)
	{
		sizeX = x;
		sizeY = y;
		sizeZ = z;
	}

	// Return the width of the image (not pixels!!!)
	inline real width() { return sizeX; }

	// Return the length of the image (not pixels!!!)
	inline real length() { return sizeY; }

	// Return the height of the image (not pixels!!!)
	inline real height() { return sizeZ; }
};

#endif
