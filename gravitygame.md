# Gravity Game

## Limitations
 
Obviously its in 2D, so doesn't account for, for example, the tilt of the orbit of Earth.
It also doesn't account for spin, tides, warping of time(?). The simulation is quite slow(comparitively) and unoptimized.

 **EXCEPT from those**, it's quite accurate, if you go along with the *"everything's 2D/all orbits are flat"* assumptions. 


## How it works(math/physics side)
It's not complicated. Using Newton's gravity equation, we can get the force:

<img src="https://www.gstatic.com/education/formulas2/397133473/en/newton_s_law_of_universal_gravitation.svg" height="50">

 \- <img src="https://render.githubusercontent.com/render/math?math=F" height="11"> is the 
attracting force on both of these two bodies(Crazy how a falling apple have the same greatness of a force falling to the ground as Earth "falling" into the apple).

 \- <img src="https://render.githubusercontent.com/render/math?math=G" height="11"> is the 
universal gravitational constant, 

 \- <img src="https://render.githubusercontent.com/render/math?math=m_1" height="12"> and 
 <img src="https://render.githubusercontent.com/render/math?math=m_2" height="12">
are the two celetrial bodies' mass, 

 \- <img src="https://render.githubusercontent.com/render/math?math=r" height="8"> is the distance between the two(we use the distance formula for this).

<br/><br/>
Now that we found the force, we can use Newton's second law to find the acceleration of a specific object:

<img src="https://www.gstatic.com/education/formulas2/397133473/en/newtons_second_law.svg">

 \- <img src="https://render.githubusercontent.com/render/math?math=F" height="11"> the attracting force we got from the previous step
 
  \- <img src="https://render.githubusercontent.com/render/math?math=m" height="9"> the mass(should be the same unit as before)
  
   \- <img src="https://render.githubusercontent.com/render/math?math=a" height="9"> the acceleraton of the object

Acceleration is basically how the speed of an object changes([Khan Academy Video](https://www.khanacademy.org/science/physics/one-dimensional-motion/acceleration-tutorial/v/acceleration)).
To get the new velocity of an object:
<img src="https://render.githubusercontent.com/render/math?math=v = u + at" height="11">
