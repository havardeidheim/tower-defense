# Tower defense port
I want to port an original java tower defense game to typescript. 

The game is a classic tower defense game where the player defends a target from waves of enemies by building towers along the path that shoot projectiles at the enemies.

The original game code and resources can be found in the folder 'original-java-game/'

The game should use a simple game loop and a fixed framerate of 60. The game should use a simple html canvas for rendering, and each object should have a render method that renders itself.

The player has a certain amount ofg lives, and every enemy that makes it through each level will reduce the lives of the player. If lives goes to 0 the level is failed. If all waves of enemies are defeated while the player has lives remaining the level is won.

## Game objects

There are multiple types of game objects, enemies and towers, etc. They are defined here:
* Enemies: 'original-java-game\src\enemies'
* Tiles: Tiles are defined in 
* Towers: 'original-java-game\src\towers'
* Projectiles: 'original-java-game\src\projectiles'
* Spells: 'original-java-game\src\spells'
* Buttons/actions: 'original-java-game\src\knapper'

### Graphics

All enemies have unique graphics, each enemy has a .png file with the images of the enemies. In the original game each direction has its own sprite, in the port i would like to just use one sprite and instead rotate the enemies in game as they move.
Other objects and tiles also have their own .png files with graphcs for that object.

## Enemies

Enemies spawn at the source of each map and finds a path to the goal. Each enemy killed nets the player some gold. Enemies have various attributes.


## In game menu

There is an in game menu where the player can build towers, cast spells and see accumulated gold and mana. Clicking towers also displays a tower-action menu where you can upgrade or sell towers.


### Spells

The player can cast spells, and has a 'mana-account' that accumulates mana that can be used to cast spells.


### Building towers

The player can buy and build towers, towers can only be placed on suitable tiles that can also be buildt by the player and exists naturally on most maps.


## Levels

Levels are defined in txt files located in 'original-java-game\src\resources\levels', with map layout and wave data in two separate files. A level consists of a grid of tiles.

## Level select

The game has a level select where each level can be started, along with the stars earned on that level, corresponding to the number of lives lost during a map. Earned stars and if a level has been completed was stored in a txt file 'original-java-game/data.txt' for the ts port i want to use a cookie based save system that stores this data.


## Sounds 

The game also has sound in .wav files for different occations.


## Resources and loading

As the game has external resource files, .png and .wav. i would like each resource to be loaded when the game starts with a loading bar matching the style of the level select. Then used from memory when the game runs. The loading should just happen once.


## Implementation Plan

Create a thurough plan for implementing each part, write the plan to a file implementation-plan.md and then follow the plan for implementing each part of the game.

Use agents or reset context when appropriate to avoid exceeding the window or getting worse results.


## Verification

After implementing the game, verify that all features are complete and that they match the original game.