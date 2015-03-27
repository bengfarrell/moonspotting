var App = function() {
    var self = this;

    this.camera;

    this.scene;

    this.renderer;

    this.mesh;

    this.spot;

    this.effect;

    this.stereoEnabled = true;

    /**
     * init scene
     */
    this.init = function() {
        self.renderer = new THREE.WebGLRenderer();
        self.renderer.setPixelRatio( window.devicePixelRatio );
        self.renderer.setSize( window.innerWidth, window.innerHeight )
        document.body.appendChild( self.renderer.domElement );

        self.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2200 );
        self.camera.position.z = 400;

        self.scene = new THREE.Scene();

        var geometry = new THREE.SphereGeometry( 1800, 32, 32 );

        var texture = THREE.ImageUtils.loadTexture( 'images/sphere.jpg' );
        texture.anisotropy = self.renderer.getMaxAnisotropy();

        var material = new THREE.MeshLambertMaterial( { map: texture, side: THREE.BackSide } );
        self.mesh = new THREE.Mesh( geometry, material );
        self.scene.add( self.mesh );

        var light = new THREE.PointLight( 0xffffff, 2, 5000 );
        light.position.set(0, 0, 400 );
        self.scene.add( light );

        self.spot = new THREE.SpotLight( 0xff0000, 32, 2800, Math.PI/10, 300 );
        self.spot.position.set( 0, 0, 400 );
        self.scene.add(self.spot.target)
        self.scene.add(self.spot);

        if (self.stereoEnabled) {
            self.effect = new THREE.StereoEffect( self.renderer );
            self.effect.eyeSeparation = 3;
            self.effect.setSize( window.innerWidth, window.innerHeight );
        }

        window.addEventListener( 'resize', this.onWindowResize, false );
        document.addEventListener('keydown', this.onKeyboardInput, false );
        document.addEventListener('mousemove', this.onMouseMove, false );
    };

    /**
     * on keyboard input
     * @param event
     */
    this.onKeyboardInput = function(event) {
        switch (event.keyCode) {
            // left
            case 37: self.camera.rotation.y += 0.01; break;

            // right
            case 39: self.camera.rotation.y -= 0.01; break;

            // up
            case 38: self.camera.rotation.x -= 0.01; break;

            // down
            case 40: self.camera.rotation.x += 0.01; break;

            // a:
            case 65: self.spot.exponent -= 10; break;

            // s:
            case 83: self.spot.exponent += 10; break;
        }
    };

    /**
     * on window resize
     */
    this.onWindowResize = function() {
        self.camera.aspect = window.innerWidth / window.innerHeight;
        self.camera.updateProjectionMatrix();
        if (self.stereoEnabled) {
            self.effect.setSize( window.innerWidth, window.innerHeight );
        } else {
            self.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    };

    /**
     * on mouse move
     * @param event
     */
    this.onMouseMove = function(event) {
        var vector = new THREE.Vector3( (event.clientX / window.innerWidth) *2 -1, -(event.clientY / window.innerHeight) *2 +1 , 0.5 );
        vector.unproject(self.camera);
        var ray = new THREE.Raycaster( self.camera.position, vector.sub( self.camera.position ).normalize() );
        var intersects = ray.intersectObjects( [self.mesh] );

        if (intersects.length > 0) {
            self.spot.target.position.set( intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
        }
    };

    /**
     * on animate
     */
    this.animate = function() {
        window.requestAnimationFrame( self.animate );

        if (self.stereoEnabled) {
            self.effect.render( self.scene, self.camera );
        } else {
            self.renderer.render( self.scene, self.camera );
        }
    };
};

var app = new App();
app.init();
app.animate();
