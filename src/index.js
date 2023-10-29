(function() {
    var countdown = null;

    const parts = {
        "days": {
            "next": null,
            "prev": "hours",
            "value": 0,
            "maxValue": 1000,
            "element": null,
            "input": null,
        },
        "hours": {
            "next": "days",
            "prev": "minutes",
            "value": 0,
            "maxValue": 24,
            "element": null,
            "input": null,
        },
        "minutes": {
            "next": "hours",
            "prev": "seconds",
            "value": 0,
            "maxValue": 60,
            "element": null,
            "input": null,
        },
        "seconds": {
            "next": "minutes",
            "prev": null,
            "value": 0,
            "maxValue": 60,
            "element": null,
            "input": null,
        },
    };

    const state = {
        "counting": false,
        "total": 0,
        "current": 0,
    };

    const parseTime = function() {
        var total = 0;

        var part = "days";
        while (part) {
            const partObj = parts[part];
            total *= partObj.maxValue;
            total += partObj.value;

            part = partObj.prev;
        };
        return total;
    }

    const update = function(value) {
        
        var part = "seconds";
        while (part) {
            const partObj = parts[part];
            const maxValue = partObj.maxValue;
            partObj.value = value % maxValue;
            partObj.input.value = partObj.value;
            value = Math.floor(value / maxValue);

            part = partObj.next;
        };
    }

    const start = function() {
        state.total = parseTime();
        state.current = state.total;
        state.counting = true;

        countdown.classList.add("counting");

        var part = "seconds";
        while(part) {
            const partObj = parts[part];
            partObj.input.disabled = true;
            part = partObj.next;
        }
    }

    const stop = function() {
        state.counting = false;

        countdown.classList.remove("counting");

        var part = "seconds";
        while(part) {
            const partObj = parts[part];
            partObj.input.disabled = false;
            part = partObj.next;
        }
    }

    window.addEventListener("load", function() {
        countdown = document.getElementById("countdown");
        Array.from(countdown.getElementsByClassName("part")).forEach(element => {
            const part = parts[element.id];
            part.element = element;
            part.input = element.getElementsByTagName("input")[0];

            part.input.addEventListener("input", function(event) {
                part.input.value = part.input.value.replace(/[^0-9]/, "");
            });
            part.input.addEventListener("blur", function(event) {
                const value = parseInt(part.input.value);
                if (value >= part.maxValue) {
                    if (part.next) {
                        part.input.value = value % part.maxValue;
                        parts[part.next].input.value = parseInt(parts[part.next].input.value) + Math.floor(value / part.maxValue);
                        parts[part.next].input.dispatchEvent(new FocusEvent("blur"));
                    } else {
                        // ugly hack to only reset to 0 if the blur event was caused by cascading changes
                        if (Math.abs(value - part.value) == 1) {
                            part.input.value = 0;
                        } else {
                            part.input.value = part.maxValue - 1;
                        }
                    }
                } else if (value < 0) {
                    if (part.next) {
                        part.input.value = value + part.maxValue * Math.ceil(-value / part.maxValue);
                        parts[part.next].input.value = parseInt(parts[part.next].input.value) + Math.floor(value / part.maxValue);
                        parts[part.next].input.dispatchEvent(new FocusEvent("blur"));
                    } else {
                        part.input.value = part.maxValue - 1;
                    }
                } else {
                    part.input.value = value;
                }
                part.value = parseInt(part.input.value);
            });

            element.getElementsByClassName("up")[0].addEventListener("click", function(event) {
                part.input.value = parseInt(part.input.value) + 1;
                part.input.dispatchEvent(new FocusEvent("blur"));
            });

            element.getElementsByClassName("down")[0].addEventListener("click", function(event) {
                part.input.value = parseInt(part.input.value) - 1;
                part.input.dispatchEvent(new FocusEvent("blur"));
            });
        });

        document.getElementById("start").addEventListener("click", start);

        window.setInterval(function() {
            if (state.counting) {
                console.log(state.current);
                state.current--;
                update(state.current);

                if (state.current == 0) {
                    stop();
                }
            }
        }, 1000);
    });
})();