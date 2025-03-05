class Line {
    constructor(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.width = 5;
        this.red = 0;
        this.green = 0;
        this.blue = 0;
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

    let rect_button = document.getElementById("rect");
    let are_selected = {
        rect: false
    }
    let onPage = [];

    let colour_input = document.getElementById("colour");
    let selected_colour = colour_input.value;

    let width_input = document.getElementById("width");
    let line_width = width_input.value;

    let x_down, y_down, x_up, y_up;

    // signify that the RECT tool is selected 
    rect_button.addEventListener("click", function (event) {
        are_selected.rect = true;
    });

    colour_input.addEventListener("input", function (event) {
        selected_colour = colour_input.value;
    });

    width_input.addEventListener("input", function (event) {
        line_width = width_input.value; 
    });


    c.addEventListener("mousedown", function (event) {
        x_down = event.pageX - this.offsetLeft;
        y_down = event.pageY - this.offsetTop;

    });
    c.addEventListener("mouseup", function (event) {
        x_up = event.pageX - this.offsetLeft;
        y_up = event.pageY - this.offsetTop;

        let rect = new Rectangle(x_down, y_down, x_up, y_up, selected_colour, line_width);

        onPage.push(rect);

        refresh_screen();
    });

    function refresh_screen() {
        for (let i of onPage) {
            i.draw(ctx);
        }
    }


});