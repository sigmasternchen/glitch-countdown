(function() {
    var counting = false;

    const parts = {
        "days": {
            "next": null,
            "prev": "hours",
            "value": 0,
            "maxValue": 999,
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
    }

    window.addEventListener("load", function() {
        Array.from(document.getElementById("countdown").getElementsByClassName("part")).forEach(element => {
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
                            part.input.value = part.maxValue;
                        }
                    }
                } else if (value < 0) {
                    if (part.next) {
                        part.input.value = value + part.maxValue * Math.ceil(-value / part.maxValue);
                        parts[part.next].input.value = parseInt(parts[part.next].input.value) + Math.floor(value / part.maxValue);
                        parts[part.next].input.dispatchEvent(new FocusEvent("blur"));
                    } else {
                        part.input.value = part.maxValue;
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
    });
})();