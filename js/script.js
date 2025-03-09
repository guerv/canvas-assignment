class Line {
    shape = "line";

    constructor(x0, y0, x1, y1, colour, thickness) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.colour = colour;
        this.thickness = thickness;
    }

    setColour(colour) {
        this.colour;
    }

    draw(ctx) {
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = this.thickness;
        ctx.beginPath();
        ctx.moveTo(this.x0, this.y0);
        ctx.lineTo(this.x1, this.y1);
        ctx.closePath();
        ctx.stroke();
        //console.log("line drawn");
    }


}

class Rectangle {
    shape = "rect";

    constructor(x0, y0, x1, y1, colour, line_width) {
        if (x0 > x1) {
            let x_temp = x0;
            x0 = x1;
            x1 = x_temp;
        }
        if (y0 > y1) {
            let y_temp = y0;
            y0 = y1;
            y1 = y_temp;
        }

        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.width = Math.abs(x1 - x0);
        this.height = Math.abs(y1 - y0);
        this.colour = colour;
        this.line_width = line_width;
    }

    setColour(colour) {
        this.colour;
    }

    draw(ctx) {
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = this.line_width;
        ctx.strokeRect(this.x0, this.y0, this.width, this.height);
    }
}

class Circle {
    shape = "circle";

    constructor(x0, y0, x1, y1, colour, line_width) {
        
        let bottom = 1, right = 1; 
        if (x1 < x0) {
            right = -1;
        }
        if (y1 < y0) {
            bottom = -1;
        }


        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;

        this.radius = Math.abs(this.y1 - this.y0) > Math.abs(this.x1 - this.x0) ? Math.abs(this.x1 - this.x0) /2 : Math.abs(this.y1 - this.y0) /2;

        this.x = this.x0 + (right)*this.radius; 
        this.y = this.y0 + (bottom)*this.radius; 


        this.colour = colour;
        this.line_width = line_width;
    }


    setColour(colour) {
        this.colour = colour;
    }

    draw(ctx) {
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = this.line_width;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
}



window.addEventListener("load", function (event) {
    //this.localStorage.clear();
    let c = document.getElementById("paint_canvas");
    let ctx = c.getContext("2d");
    const LINE = 0, RECT = 1, CIRCLE = 2;


    let shape_buttons = []; 
    let rect_button = document.getElementById("rect");
    shape_buttons.push(rect_button);
    let line_button = document.getElementById("line");
    shape_buttons.push(line_button);
    let circle_button = document.getElementById("circle");
    shape_buttons.push(circle_button);
    let onPage = [];
    set_selected_css(line_button); 
    let is_selected = 0;

    let colour_input = document.getElementById("colour");
    let selected_colour = colour_input.value;

    /*
    let width_input = document.getElementById("width");
    let line_width = width_input.value;*/

    // NEW
    let thickness_input = document.getElementById("thickness");
    let thickness_var = document.getElementById("thickness_value");
    let line_width = parseInt(thickness_input.value);
    thickness_var.innerHTML= line_width; 
    //

    let undo_input = document.getElementById("undo");
    let clear_input = document.getElementById("clear");

    let warning_node = document.getElementById("warning");

    let x_down, y_down, x_up, y_up, x_drag, y_drag;
    let drag = false, new_obj = true, left_screen = false;

    //load canvas from localStorage

    if (localStorage["onPage"]) {
        refresh_local();
    }


    // signify that the RECT tool is selected 
    rect_button.addEventListener("click", function (event) {
        is_selected = 1;
        set_selected_css(rect_button); 
    });
    line_button.addEventListener("click", function (event) {
        is_selected = 0;
        set_selected_css(line_button); 
    });
    circle_button.addEventListener("click", function (event) { 
        is_selected = 2;
        set_selected_css(circle_button); 
     });


    colour_input.addEventListener("input", function (event) {
        selected_colour = colour_input.value;
    });

    //NEW
    thickness_input.addEventListener("input", function (event) {
        line_width = parseInt(thickness_input.value);
        thickness_var.innerHTML= line_width; 
    });
    //

    /*
    width_input.addEventListener("input", function (event) {
        line_width = width_input.value;
    });*/

    undo_input.addEventListener("click", function (event) {
        onPage.pop();
        update_local();
        refresh_screen();
    });

    clear_input.addEventListener("click", function (event) {
        onPage = [];
        update_local();
        clear_screen();
    });

    // c.addEventListener("mouseover", function (event) {

    c.addEventListener("mousedown", function (event) {
        //console.log("Mouse down")
        drag = true;
        new_obj = true;
        x_down = event.pageX - this.offsetLeft;
        y_down = event.pageY - this.offsetTop;

        left_screen = false;

    });

    c.addEventListener("mousemove", function (event) {

        if (drag) {
            if (!new_obj) {
                onPage.pop();
                //console.log("loving myself");
            }
            x_drag = event.pageX - this.offsetLeft;
            y_drag = event.pageY - this.offsetTop;
            let obj;
            if (is_selected == LINE) {
                obj = new Line(x_down, y_down, x_drag, y_drag, selected_colour, line_width);
            }
            else if (is_selected == RECT) {
                obj = new Rectangle(x_down, y_down, x_drag, y_drag, selected_colour, line_width);
            }
            else if (is_selected == CIRCLE) {
                obj = new Circle(x_down, y_down, x_drag, y_drag, selected_colour, line_width);
            }
            onPage.push(obj);

            update_local();
            refresh_screen();
            new_obj = false;
        }

    });

    c.addEventListener("mouseup", function (event) {
        if (!new_obj)
            onPage.pop();

        drag = false;
        new_obj = true;

        //console.log("Mouse up and new_obj:" + new_obj);


        x_up = event.pageX - this.offsetLeft;
        y_up = event.pageY - this.offsetTop;

        let obj;
        if (!left_screen) {
            if (is_selected == LINE) {
                obj = new Line(x_down, y_down, x_up, y_up, selected_colour, line_width);
            }
            else if (is_selected == RECT) {
                obj = new Rectangle(x_down, y_down, x_up, y_up, selected_colour, line_width);
            }
            else if (is_selected == CIRCLE) {
                obj = new Circle(x_down, y_down, x_up, y_up, selected_colour, line_width);
            }
            onPage.push(obj);
        }

        update_local();


        refresh_screen();
    });
    //});

    c.addEventListener("mouseout", function (event) {
        if (!new_obj) {
            onPage.pop();
            drag = false;
            new_obj = true;

            update_local();
            refresh_screen();
        }
        left_screen = true;

        warning_node.style.visibility= "visible";
        console.log("bye");
    });

    c.addEventListener("mouseover", function(event) {
        arning_node.style.visibility= "hidden";
        console.log("hi");
    });


    function refresh_screen() {
        clear_screen();
        for (let i of onPage) {
            i.draw(ctx);
        }
    }

    function refresh_local() {
        clear_screen();
        onPage = [];
        let obj;

        for (let i of JSON.parse(localStorage["onPage"])) {
            //console.log(i); COOOOL
            if (i.shape == "line") {
                onPage.push(new Line(i.x0, i.y0, i.x1, i.y1, i.colour, i.thickness));
            }
            else if (i.shape == "rect") {
                onPage.push(new Rectangle(i.x0, i.y0, i.x1, i.y1, i.colour, i.line_width));
            }
            else if (i.shape == "circle") {
                onPage.push(new Circle(i.x0, i.y0, i.x1, i.y1, i.colour, i.line_width));
            }
        }

        refresh_screen();
    }

    function clear_screen() {
        ctx.clearRect(0, 0, c.width, c.height);
    }

    function update_local() {
        localStorage["onPage"] = JSON.stringify(onPage);
    }

    function set_selected_css(node) {
        for (let e of shape_buttons) {
            if (e !== node){
                e.classList.remove("selected"); 
            }
        }
        node.classList.add("selected"); 
    }


});