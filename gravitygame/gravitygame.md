# Gravity Game

## Limitations
 
Obviously its in 2D, so doesn't account for, for example, the tilt of the orbit of Earth.
It also doesn't account for spin, tides, warping of time(?). The simulation is quite slow(comparitively) and unoptimized.

It is also critically depent on the "time resolution". Sometimes if the objects are going too fast, they might teleport through each other.

 **EXCEPT from those**, it's pretty accurate, if you go along with the *"everything's 2D/all orbits are flat"* assumptions. 
 
 One way it shows is I only entered all of the planet's aphelion(and correspondingly, the minimum speed). So if you watch closely, the computed 
 maximum speed match quite accurately with the real maximum speed.


## How it works(math/physics side)
Basically our main goal here is to find the next position of an object after a small time(essentially resolution). 
To do that, we need to calculate the velocity of that object. 


Here, I'll use the Earth as an example.

Using Newton's gravity equation, we can get the force attracting between two objects(the force between Sun and Earth, in this example):

<img src="https://www.gstatic.com/education/formulas2/397133473/en/newton_s_law_of_universal_gravitation.svg" height="50">

 \- <img src="https://render.githubusercontent.com/render/math?math=F" height="11"> is the 
attracting force on both of these two bodies(Crazy to me how a falling apple have the same magnitude of force falling to Earth as Earth "falling" into the apple).

 \- <img src="https://render.githubusercontent.com/render/math?math=G" height="11"> is the 
universal gravitational constant, 

 \- <img src="https://render.githubusercontent.com/render/math?math=m_1" height="12"> and 
 <img src="https://render.githubusercontent.com/render/math?math=m_2" height="12">
are the two celetrial bodies' mass, 

 \- <img src="https://render.githubusercontent.com/render/math?math=r" height="8"> is the distance between the two(we use the distance formula for this).
<hr>
Now that we found the force, we can use Newton's second law to find the acceleration of one of the two objects(Earth, in this example):

<img src="https://www.gstatic.com/education/formulas2/397133473/en/newtons_second_law.svg">

 \- <img src="https://render.githubusercontent.com/render/math?math=F" height="11"> the attracting force we got from the previous step
 
  \- <img src="https://render.githubusercontent.com/render/math?math=m" height="9"> the mass(should be the same unit as before)
  
   \- <img src="https://render.githubusercontent.com/render/math?math=a" height="9"> the acceleraton of the object
   
Acceleration is basically how the speed of an object changes. I won't go into details but here's a khan academy [video](https://www.khanacademy.org/science/physics/one-dimensional-motion/acceleration-tutorial/v/acceleration) on it. 
<hr>

Basically: 

 > next_speed = (current_accleration * time_resolution) + current_speed. 

The "time_resolution" here should be as small as possible since the accleration will always be changing, but the smaller "resolution_time" is, the more iterations we have to do per second.
<hr>

Now that we know the speed, but we also need the direction it's going. We know that gravity is attracting two objects, so the direction would just be towards the other object. Specifically to actually calculate the velocity vector:
1. Subtract the "other object"'s(the Sun, in this example) position vector from the object in question(the Earth).
2. Normalize that vector(set magnitude to 1)
3. Multiply by speed.

Voila! After all this, we have the velocity of the object(Earth) being attracted by gravity from another one(Sun). 
Now if we multiply the velocity by "time resolution", add the vector to the current position vector, we will get the new position for Earth after "time resolution" amount of time.

As for multiple objects, you basically repeat the above steps, replace the "other object"(Sun) with a different one(A rogue planet, perhaps), and then add the final velocity vector of Earth towards *the rogue planet* with velocity vector of Earth towards *the Sun*. 


## Programming

I used below libraries:
* [**Phaser**](https://phaser.io/)
* [**Victor.js**](http://victorjs.org/)
* Bootstrap, Jquery, all the normal stuff with web dev

### Regrets:
1. **Using Phaser.** It was quite the pain(comparitively). 

   Although it was better than nothing, it's documentation(version 2 and 3 being mixed) wasn't the best ever. Most 
   importnatly, it has next to zero UI support. Like you can't even have a checkbox without haveing to use DOM.
   However, maybe I'm too harshly judging it, since I'm so used to Unity now.
2. **Using javascript.** No more needed to be said. I probably should've used typescript or something.

**However**, I'm pretty happy how this project came out. Although not the most original idea, it's a good topic for my first web game.

