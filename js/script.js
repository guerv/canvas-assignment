/**
 * Author: Natalia Guevara
 * Student Number: 400570316
 * Class: CS 1XD3
 * Date Created: 1 March 2025
 * Date Last Modified: 9 March 2025
 * Description: JavaScript file for Canvas Assignment. Includes DOM manipulation, obj of arrays, local storage.
 */

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

    draw(ctx) {
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = this.thickness;
        ctx.beginPath();
        ctx.moveTo(this.x0, this.y0);
        ctx.lineTo(this.x1, this.y1);
        ctx.closePath();
        ctx.stroke();
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

        this.radius = Math.abs(this.y1 - this.y0) > Math.abs(this.x1 - this.x0) ? Math.abs(this.x1 - this.x0) / 2 : Math.abs(this.y1 - this.y0) / 2;

        this.x = this.x0 + (right) * this.radius;
        this.y = this.y0 + (bottom) * this.radius;


        this.colour = colour;
        this.line_width = line_width;
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

/**
 * Loads JS when page renders fully 
 */
window.addEventListener("load", function (event) {
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
    let on_page = [];
    set_selected_css(line_button);
    let is_selected = 0;

    let colour_input = document.getElementById("colour");
    let selected_colour = colour_input.value;

    let thickness_input = document.getElementById("thickness"); // the slider itself for thickness
    let thickness_var = document.getElementById("thickness_value"); // the SPAN element that will dynamically change .innerHTML
    let line_width = parseInt(thickness_input.value);
    thickness_var.innerHTML = line_width;

    let undo_input = document.getElementById("undo");
    let clear_input = document.getElementById("clear");

    let warning_node = document.getElementById("warning");

    let x_down, y_down, x_up, y_up, x_drag, y_drag;
    let drag = false, new_obj = true, left_screen = false;

    //load canvas from localStorage
    if (localStorage["on_page"]) {
        refresh_local();
    }

    /**
     * Event Listener for selecting the Line Tool 
     * - changes shape drawn to a line
     */
    line_button.addEventListener("click", function (event) {
        is_selected = LINE;
        set_selected_css(line_button);
    });

    /**
     * Event Listener for selecting the Rectangle Tool 
     * - changes shape drawn to a rectangle 
     */
    rect_button.addEventListener("click", function (event) {
        is_selected = RECT;
        set_selected_css(rect_button);
    });

    /**
     * Event Listener for selecting the Circle Tool 
     * - changes shape drawn to a circle  
     */
    circle_button.addEventListener("click", function (event) {
        is_selected = CIRCLE;
        set_selected_css(circle_button);
    });

    /** 
     * Event Listener for Changing Shape's Colour
     * - changes selected colour var to the given colour changed to 
     */
    colour_input.addEventListener("input", function (event) {
        selected_colour = colour_input.value;
    });

    /** 
     * Event Listener for Changing Shape's Thickness 
     * - changes selected thickness var to the given thickness changed to 
     */
    thickness_input.addEventListener("input", function (event) {
        line_width = parseInt(thickness_input.value);
        thickness_var.innerHTML = line_width;
    });

    /**
     * Event Listener for Undo Button 
     * - removes latest shape
     * - updates local storage and refreshes screen
     */
    undo_input.addEventListener("click", function (event) {
        on_page.pop();
        update_local();
        refresh_screen();
    });

    /**
     * Event Listener for Undo Button 
     * - removes all shapes
     * - updates local storage and refreshes screen
     */
    clear_input.addEventListener("click", function (event) {
        on_page = [];
        update_local();
        clear_screen();
    });


    /**
     * Event Listener for Canvas - Mouse Down 
     * - indicates that a shape will be drawn
     * - logs x/y coords of start position
     */
    c.addEventListener("mousedown", function (event) {
        drag = true;
        new_obj = true;
        x_down = event.pageX - this.offsetLeft;
        y_down = event.pageY - this.offsetTop;

        left_screen = false;
    });

    /**
     * Event Listener for Canvas - Mouse Move 
     * - renders a new shape depending on the predicted ending position 
     * - updates local storage and refreshes screen
     */
    c.addEventListener("mousemove", function (event) {
        if (drag) {
            if (!new_obj) {
                on_page.pop();
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

            on_page.push(obj);

            update_local();
            refresh_screen();
            new_obj = false;
        }
    });

    /**
     * Event Listener for Canvas - Mouse Up
     * - adds a new shape to the canvas depending on the starting and ending x/y coords 
     * - updates local storage and refreshes screen
     */
    c.addEventListener("mouseup", function (event) {
        if (!new_obj)
            on_page.pop();

        drag = false;
        new_obj = true;

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
            on_page.push(obj);
        }

        update_local();
        refresh_screen();
    });


    /**
     * Event Listener for Canvas - Mouse Out
     * - prevents shapes from being drawn it outside canvas
     * - shows feedback when user leaves canvas
     * - updates local storage and refreshes screen
     */
    c.addEventListener("mouseout", function (event) {
        if (!new_obj) {
            on_page.pop();
            drag = false;
            new_obj = true;

            update_local();
            refresh_screen();
        }
        left_screen = true;

        warning_node.style.visibility = "visible";
    });

    /**
     * Event Listener For Canvas - Mouse Over
     * - hides feedback when user is over canvas
     */
    c.addEventListener("mouseover", function (event) {
        warning_node.style.visibility = "hidden";
    });


    /**
     * Redraws every object in the array of objs `on_page`
     * - uses each obj's draw method to draw the appropriate shape onto the canvas 
     */
    function refresh_screen() {
        clear_screen();
        for (let i of on_page) {
            i.draw(ctx);
        }
    }

    /**
     * On reloading tab, adds the local storage of `on_page` array of obj shapes to the actual `on_page` array
     * - then refreshes screen to show these previously drawn shapes
     */
    function refresh_local() {
        clear_screen();
        on_page = [];

        for (let i of JSON.parse(localStorage["on_page"])) {
            //console.log(i); COOOOL
            if (i.shape == "line") {
                on_page.push(new Line(i.x0, i.y0, i.x1, i.y1, i.colour, i.thickness));
            }
            else if (i.shape == "rect") {
                on_page.push(new Rectangle(i.x0, i.y0, i.x1, i.y1, i.colour, i.line_width));
            }
            else if (i.shape == "circle") {
                on_page.push(new Circle(i.x0, i.y0, i.x1, i.y1, i.colour, i.line_width));
            }
        }
        refresh_screen();
    }

    /**
     * Wipes the screen of all drawings
     */
    function clear_screen() {
        ctx.clearRect(0, 0, c.width, c.height);
    }

    /**
     * Adds obj information in `on_page` to local storage
     */
    function update_local() {
        localStorage["on_page"] = JSON.stringify(on_page);
    }

    /**
     * When a shape is selected, changes its CSS to show it is selected
     * - specified to change only the classlist of param node 
     * 
     * @param {HTMLElement} node 
     */
    function set_selected_css(node) {
        for (let e of shape_buttons) {
            if (e !== node) {
                e.classList.remove("selected");
            }
        }
        node.classList.add("selected");
    }
});