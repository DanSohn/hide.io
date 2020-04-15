
//Draws the rays from each point from this.state.hitpoints -- DISABLED -- used to Debug
drawLightLines() {
    this.ctx.save();
    let playerX = this.Player.screenX - this.Player.width / 2 + 32;
    let playerY = this.Player.screenY - this.Player.height / 2 + 32;
    this.ctx.strokeStyle = "#FFFFFF";
    this.ctx.beginPath();
    for (let i = 0; i < this.state.hitpoints.length; i++) {
        let hitpoint = this.state.hitpoints[i];
        this.ctx.moveTo(playerX, playerY);
        this.ctx.lineTo(hitpoint.x, hitpoint.y);
        // this.ctx.fillRect(hitpoint.x - 5, hitpoint.y - 5, 10, 10);
    }
    this.ctx.stroke();
    this.ctx.restore();
}

drawPillarLight() {
    let playerX = this.Player.screenX - this.Player.width / 2 + 32;
    let playerY = this.Player.screenY - this.Player.height / 2 + 32;

    this.ctx.save();
    let fill = this.ctx.createRadialGradient(playerX, playerY, 1, playerX, playerY, 64);
    fill.addColorStop(0, "rgba(255, 255, 255, 0.55)");
    fill.addColorStop(1, "rgba(255, 255, 255, 0.01)");

    this.ctx.fillStyle = fill;
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.hitpoints[0].x, this.state.hitpoints[0].y);
    for (let i = 1; i < this.state.hitpoints.length; i++) {
        let intersect = this.state.hitpoints[i];
        this.ctx.lineTo(intersect.x, intersect.y);
    }
    this.ctx.rect(1024, 0, -1024, 620);

    this.ctx.fill();
    this.ctx.restore();
}