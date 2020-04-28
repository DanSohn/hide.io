export default class Wall{
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.points = [p1, p2];
    }
    length() {
        // Logic is: sqrt( ((Pos2.x-Pos1.x)^2) + ((Pos2.y-Pos1.y)^2)) )
		return Math.sqrt(Math.pow(this.p2.x-this.p1.x, 2)+Math.pow(this.p2.y-this.p1.y, 2));
    }
}
