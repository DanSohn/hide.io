

export default class PlayerTest {
    constructor(map, x, y) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.width = map.tsize;
        this.height = map.tsize;
        this.deltaSpeed = 0;

        this.SPEED = 256;
    }


    move(delta, dirx, diry, enamyMap) {
        // move hero
        this.x += dirx * (5.0 + this.deltaSpeed);
        this.y += diry * (5.0 + this.deltaSpeed);

        // check if we walked into a non-walkable tile
        this._collide(dirx, diry);
        // this._enamyCollide(dirx, diry, enamyMap);

        // clamp values
        let maxX = this.map.cols * this.map.tsize;
        let maxY = this.map.rows * this.map.tsize;
        this.x = Math.max(0, Math.min(this.x, maxX));
        this.y = Math.max(0, Math.min(this.y, maxY));
    };

    _collide(dirx, diry) {
        let row, col;
        // -1 in right and bottom is because image ranges from 0..63
        // and not up to 64
        let left = this.x - this.width / 2;
        let right = this.x + this.width / 2 - 1;
        let top = this.y - this.height / 2;
        let bottom = this.y + this.height / 2 - 1;

        // check for collisions on sprite sides
        let collision =
            this.map.isSolidTileAtXY(left, top) ||
            this.map.isSolidTileAtXY(right, top) ||
            this.map.isSolidTileAtXY(right, bottom) ||
            this.map.isSolidTileAtXY(left, bottom);
        if (!collision) { return; }

        if (diry > 0) {
            row = this.map.getRow(bottom);
            this.y = -this.height / 2 + this.map.getY(row);
        }
        else if (diry < 0) {
            row = this.map.getRow(top);
            this.y = this.height / 2 + this.map.getY(row + 1);
        }
        else if (dirx > 0) {
            col = this.map.getCol(right);
            this.x = -this.width / 2 + this.map.getX(col);
        }
        else if (dirx < 0) {
            col = this.map.getCol(left);
            this.x = this.width / 2 + this.map.getX(col + 1);
        }
    };

    _enamyCollide(dirx, diry, enamyMap) {
        // -1 in right and bottom is because image ranges from 0..63
        // and not up to 64
        let left = this.x - this.width / 2;
        let right = this.x + this.width / 2 - 1;
        let top = this.y - this.height / 2;
        let bottom = this.y + this.height / 2 - 1;


        // if (diry > 0) {
        //     row = this.map.getRow(bottom);
        //     this.y = -this.height / 2 + this.map.getY(row);
        // }
        // else if (diry < 0) {
        //     row = this.map.getRow(top);
        //     this.y = this.height / 2 + this.map.getY(row + 1);
        // }
        // else if (dirx > 0) {
        //     col = this.map.getCol(right);
        //     this.x = -this.width / 2 + this.map.getX(col);
        // }
        // else if (dirx < 0) {
        //     col = this.map.getCol(left);
        //     this.x = this.width / 2 + this.map.getX(col + 1);
        // }
    };
}