//
// Material.cpp
//
// See header file for structural information.
//
//
// Created by Scott McDermott (mcdermottscott@yahoo.com)
// 08/16/04
//
// Modified by Scott McDermott (mcdermottscott@yahoo.com)
// 2/13/05
//
// Modified by Scott McDermott (mcdermottscott@yahoo.com)
// 2/17/21 (switched to using LodePNG)
//
#include "Material.h"

#include "lodepng.h"

Material::Material()
{
	setColor();
	fileIsLoaded = false;
}

bool Material::load(string file)
{
	static int last_id = 1;

	std::vector<unsigned char> png;
	std::vector<unsigned char> image; //the raw pixels
	unsigned width, height;

	// first, try to load the image file
	unsigned error = lodepng::load_file(png, file);
	if (!error) // found the image file, now decode it
		error = lodepng::decode(image, width, height, png);   //if there's an error, display it

	if (error)	// encountered an error! 
	{
		cout << "LodePNG decoder error #" << error << ", " << lodepng_error_text(error) << " (file " << &file[0] << ")." << endl;
		fileIsLoaded = false;
		return false;
	}
	id = last_id++; //The value zero is reserved to represent the default texture for each texture target. 
	//TRACE("---Loading image file (file %s, id %i)\n", &file[0], id);

	// Now send the image data to OpenGL
	glBindTexture(GL_TEXTURE_2D, id);
	glPixelStorei(GL_UNPACK_ALIGNMENT, 1);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	// glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	//glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_DECAL);
	//image, width, height
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, &image[0]);

	fileIsLoaded = true;
	return true;

	fileIsLoaded = false;
	return false;
}



void Material::setColor(real amb0, real amb1, real amb2,
						real dif0, real dif1, real dif2,
						real spec0, real spec1, real spec2,
						real specexp)
{
	mat_amb[0] = amb0;
	mat_amb[1] = amb1;
	mat_amb[2] = amb2;
	mat_amb[3] = 1;

	mat_dif[0] = dif0;
	mat_dif[1] = dif1;
	mat_dif[2] = dif2;
	mat_dif[3] = 1;

	mat_spec[0] = spec0;
	mat_spec[1] = spec1;
	mat_spec[2] = spec2;
	mat_spec[3] = 1;

	mat_spec_exp[0] = specexp;
}

void Material::paintMaterial()
{
	bool show_colors = true;
	// Try to go with the texture material first...
	if (fileIsLoaded)
	{
		glEnable(GL_TEXTURE_2D);
		glDisable(GL_LIGHTING);
		glBindTexture(GL_TEXTURE_2D, id);
	}

	//  Otherwise, fall back on the other stuff...
	else if (show_colors)
	{
		glDisable(GL_TEXTURE_2D);
		glEnable(GL_LIGHTING);
		glMaterialfv(GL_FRONT, GL_AMBIENT, mat_amb);
		glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_dif);
		glMaterialfv(GL_FRONT, GL_SPECULAR, mat_spec);
		glMaterialfv(GL_FRONT, GL_SHININESS, mat_spec_exp);
	}
	else
	{
		glDisable(GL_TEXTURE_2D);
		glDisable(GL_LIGHTING);
		glColor3f(mat_amb[0], mat_amb[1], mat_amb[2]);
	}
}

void Material::stopMaterial()
{
	glDisable(GL_TEXTURE_2D);
	glDisable(GL_LIGHTING);
}

