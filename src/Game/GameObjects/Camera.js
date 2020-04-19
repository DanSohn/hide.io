/**
 * Camera that follows around the player.
 *
 * Used to ensure we only draw objects that are within field of view. Players kept in center of camera position
 * until they approach one of the game corners where the camera does not continue movement with the player
 * unless they leave from the corner.
 *
 */

export default class Camera {
    constructor(map, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.maxX = map.cols * map.tsize - width;
        this.maxY = map.rows * map.tsize - height;
    }
    
    
   follow(sprite) {
        this.following = sprite;
        sprite.screenX = 0;
        sprite.screenY = 0;
    };
    
    update() {
        // assume sprite is at the center of the screen
        this.following.screenX = this.width / 2;
        this.following.screenY = this.height / 2;
    
        // make the camera follow the sprite
        this.x = this.following.x - this.width / 2;
        this.y = this.following.y - this.height / 2;
        // clamp values
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));


        // in map corners, the sprite cannot be placed in the center of the screen
        // and we have to change its screen coordinates

        // left and right sides
        if (this.following.x < this.width / 2 ||
            this.following.x > this.maxX + this.width / 2) {
            this.following.screenX = this.following.x - this.x;
        }
        // top and bottom sides
        if (this.following.y < this.height / 2 ||
            this.following.y > this.maxY + this.height / 2) {
            this.following.screenY = this.following.y - this.y;
        }
    };

}