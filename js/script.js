class Line {
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
    }


}

class Rectangle {
    constructor(x0, y0, x1, y1, colour, line_width) {
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

class Stroke {

}


window.addEventListener("load", function (event) {
    let c = document.getElementById("paint_canvas");
    let ctx = c.getContext("2d");

    const LINE = 0, RECT = 1;
    is_selected = 0;

    let rect_button = document.getElementById("rect");
    let line_button = document.getElementById("line");
    let onPage = [];

    let colour_input = document.getElementById("colour");
    let selected_colour = colour_input.value;

    let width_input = document.getElementById("width");
    let line_width = width_input.value;

    let undo_input = document.getElementById("undo");
    let clear_input = document.getElementById("clear");

    let x_down, y_down, x_up, y_up;

    // signify that the RECT tool is selected 
    rect_button.addEventListener("click", function (event) {
        is_selected = 1;
    });
    line_button.addEventListener("click", function (event) {
        is_selected = 0;
    });


    colour_input.addEventListener("input", function (event) {
        selected_colour = colour_input.value;
    });

    width_input.addEventListener("input", function (event) {
        line_width = width_input.value;
    });

    undo_input.addEventListener("click", function (event) {
        onPage.pop();
        console.log(onPage);
        refresh_screen();
    });

    clear_input.addEventListener("click", function (event) {
        onPage = [];
        clear_screen();
    });


    c.addEventListener("mousedown", function (event) {
        x_down = event.pageX - this.offsetLeft;
        y_down = event.pageY - this.offsetTop;

    });
    c.addEventListener("mouseup", function (event) {
        x_up = event.pageX - this.offsetLeft;
        y_up = event.pageY - this.offsetTop;

        let obj; 
        if (is_selected == LINE) {
            obj = new Line(x_down, y_down, x_up, y_up, selected_colour, line_width); 
        }
        else if (is_selected == RECT) {
            obj = new Rectangle(x_down, y_down, x_up, y_up, selected_colour, line_width);
        }
        onPage.push(obj);


        refresh_screen();
    });

    function refresh_screen() {
        clear_screen();
        for (let i of onPage) {
            i.draw(ctx);
        }
    }

    function clear_screen() {
        ctx.clearRect(0, 0, c.width, c.height);
    }


});