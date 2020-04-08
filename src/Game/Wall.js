import Point from './Point';

export default class Wall{
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        // this.p1.parent = this;
        // this.p2.parent = this;
        this.points = [p1, p2];
    }

    length() {
		return Math.sqrt(Math.pow(this.p2.x-this.p1.x, 2)+Math.pow(this.p2.y-this.p1.y, 2));
    }

    direction(){
        let vLength = this.length();
		return new Point((this.p2.x-this.p1.x)/vLength, (this.p2.y-this.p1.y)/vLength)
    }

    intersectsWith(wall){
        let a = this.p1;
		let b = this.p2;
		let c = wall.p1;
		let d = wall.p2;
		let cmp = new Point(c.x-a.x, c.y-a.y);
		let r = new Point(b.x-a.x, b.y-a.y);
		let s = new Point(d.x-c.x, d.y-c.y);

		let cmpxr = cmp.x*r.y-cmp.y*r.x;
		let cmpxs = cmp.x*s.y-cmp.y*s.x;
		let rxs = r.x*s.y-r.y*s.x;
		if(cmpxr === 0)
			return ((c.x-a.x < 0) !== (c.x-b.x < 0))
				|| ((c.y-a.y < 0) !== (c.y-b.y < 0));
		if(rxs === 0)
			return false;

		let rxsr = 1/rxs;
		let t = cmpxs*rxsr;
		let u = cmpxr*rxsr;
		return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
    }

    intersectionPoint(wall){
        let a = this.p1;
		let b = this.p2;
		let c = wall.p1;
		let d = wall.p2;
		
		let divider = ((a.x-b.x)*(c.y-d.y)-(a.y-b.y)*(c.x-d.x));
		if(divider === 0)
			return new Point(0, 0);
		let intersectionX = ((a.x*b.y-a.y*b.x)*(c.x-d.x)-(a.x-b.x)*(c.x*d.y-c.y*d.x))/divider;
		let intersectionY = ((a.x*b.y-a.y*b.x)*(c.y-d.y)-(a.y-b.y)*(c.x*d.y-c.y*d.x))/divider;
		
		return new Point(intersectionX, intersectionY);
	}

}
