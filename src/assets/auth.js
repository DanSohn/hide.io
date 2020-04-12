export const auth = {
    isAuthenticated: false,
    login(cb){
        this.isAuthenticated = true;
        cb();
    },
    logout(cb){
        this.isAuthenticated = false;
        cb();
    }

};




