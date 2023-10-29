(function() {
    const parts = {
        "days": {
            "next": null,
            "prev": "hours",
            "maxValue": 999,
            "element": null,
            "input": null,
        },
        "hours": {
            "next": "days",
            "prev": "minutes",
            "maxValue": 24,
            "element": null,
            "input": null,
        },
        "minutes": {
            "next": "hours",
            "prev": "seconds",
            "maxValue": 60,
            "element": null,
            "input": null,
        },
        "seconds": {
            "next": "minutes",
            "prev": null,
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
                        parts[part.next].input.value = Math.floor(value / part.maxValue);
                        parts[part.next].input.dispatchEvent(new FocusEvent("blur"));
                    } else {
                        part.input.value = part.maxValue;
                    }
                } else if (value < 0) {
                    part.input.value = 0;
                } else {
                    part.input.value = value;
                }
            });
        });
    });
})();