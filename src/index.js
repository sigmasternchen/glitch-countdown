(function() {
    var countdown = null;
    var startButton = null;

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

    const convertToDisplayValue = function(raw, part) {
        return raw.toString().padStart((parts[part].maxValue - 1).toString().length, "0");
    }

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
            const positionValue = value % maxValue;
            partObj.value = positionValue;
            partObj.input.value = convertToDisplayValue(positionValue, part);
            value = Math.floor(value / maxValue);

            part = partObj.next;
        };
    }

    const setButtonText = function(text) {
        Array.from(startButton.getElementsByTagName("span")).forEach(elem => {
            elem.innerText = text;
        });
    }

    const start = function() {
        state.total = parseTime();
        state.current = state.total;
        state.counting = true;

        countdown.classList.add("counting");
        setButtonText("reset");

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
        setButtonText("start");

        var part = "seconds";
        while(part) {
            const partObj = parts[part];
            partObj.input.disabled = false;
            part = partObj.next;
        }
    }

    window.addEventListener("load", function() {
        countdown = document.getElementById("countdown");
        startButton = document.getElementById("start");

        Array.from(countdown.getElementsByClassName("part")).forEach(element => {
            const part = parts[element.id];
            part.element = element;
            part.input = element.getElementsByTagName("input")[0];

            part.input.addEventListener("input", function(event) {
                part.input.value = part.input.value.replace(/[^0-9]/, "");
            });
            part.input.addEventListener("blur", function(event) {
                const value = parseInt(part.input.value);
                var correctedValue = 0;
                if (value >= part.maxValue) {
                    if (part.next) {
                        correctedValue = value % part.maxValue;
                        parts[part.next].input.value = parseInt(parts[part.next].input.value) + Math.floor(value / part.maxValue);
                        parts[part.next].input.dispatchEvent(new FocusEvent("blur"));
                    } else {
                        // ugly hack to only reset to 0 if the blur event was caused by cascading changes
                        if (Math.abs(value - part.value) == 1) {
                            correctedValue = 0;
                        } else {
                            correctedValue = part.maxValue - 1;
                        }
                    }
                } else if (value < 0) {
                    if (part.next) {
                        correctedValue = value + part.maxValue * Math.ceil(-value / part.maxValue);
                        parts[part.next].input.value = parseInt(parts[part.next].input.value) + Math.floor(value / part.maxValue);
                        parts[part.next].input.dispatchEvent(new FocusEvent("blur"));
                    } else {
                        correctedValue = part.maxValue - 1;
                    }
                } else {
                    correctedValue = value;
                }
                part.value = correctedValue;
                part.input.value = convertToDisplayValue(correctedValue, element.id);
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

        document.getElementById("start").addEventListener("click", function() {
            if (state.counting) {
                update(state.total);
                stop();
            } else {
                start();
            }
        });

        window.setInterval(function() {
            if (state.counting) {
                console.log(state.current);
                state.current--;
                update(state.current);

                if (state.current <= 0) {
                    update(0);
                    stop();
                }

                if (countdown.classList.contains("blink")) {
                    countdown.classList.remove("blink");
                } else {
                    countdown.classList.add("blink");
                }
            } else {
                countdown.classList.remove("blink");
            }
        }, 1000);
    });
})();