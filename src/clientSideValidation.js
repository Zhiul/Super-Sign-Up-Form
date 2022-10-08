const constraintValidation = (() => {
  const forms = (() => {})();
  const inputs = (() => {})();

  const validityStatusChange = new Event("validitystatuschange");

  const initialize = (() => {
    const defaultConstraints = {
      hasValue: { value: true },
      pattern: { value: false },
      required: { value: false },
      step: { value: false },
      type: el.type,
      max: { value: false },
      maxLength: { value: false },
      min: { value: false },
      minLength: { value: false },
    };

    const form = (form, customConstraints) => {};

    const input = (
      el,
      name,
      constraints,
      form = false,
      customConstraints = false,
      handlers = inputValidator.defaultConstraintsCheckers,
      behavior = "passive",
      DOMHandler = null
    ) => {
      const setValidName = (
        name,
        index = "",
        source = form
          ? constraintsValidation.forms[form].inputs
          : constraintValidation.inputs
      ) => {
        const returnValidName = (name, index) => {
          const finalName = name + index;
          if (Boolean(source[finalName]) === false)
            return index === "" ? name : name + index;
          index === ""
            ? returnValidName(name, 1, source)
            : returnValidName(name, index + 1, source);
        };

        return returnValidName(name, index, source);
      };

      const name = setValidName(name);

      const customConstraints = (() => {
        const validCustomConstraints = {};
        if (customConstraints === false) return validCustomConstraints;

        for (const property in customConstraints) {
          if (constraintValidation.validConstraints.includes(property)) {
            validCustomConstraints[property] = customConstraints[property];
          }
        }

        return validCustomConstraints;
      })();

      const contraints = {
        ...defaultConstraints,
        ...constraints,
        ...customConstraints,
        ...handlers,
      };

      const validityStatus = "pending";

      el.addEventListener("input", () => {
        inputValidator.checkValidity(el);
      });

      let DOMHandler = DOMHandler;

      if (typeof DOMHandler !== "function") {
        DOMHandler = (formIsBeingValidated = false) => {
          function changeDOMValidityStatus() {
            el.validState = el.validityStatus;
          }

          function aggressiveDOMChange() {
            changeDOMValidityStatus();
          }

          function lazyDOMChange() {
            function lazyChange() {
              changeDOMValidityStatus();
            }

            el.addEventListener("focusout", lazyChange, { once: true });
          }

          function passiveDOMChange() {
            if (formIsBeingValidated) changeDOMValidityStatus();
          }

          function eagerDOMChange() {}
        };
      }

      el.addEventListener("validitystatuschange", () => {});
    };
  })();

  const inputValidator = (() => {
    const defaultConstraintsCheckers = {
      hasValue: { checker: checkIfInputHasValue },
      pattern: { checker: checkPattern },
      required: { checker: checkRequired },
      type: { checker: checkType },
      max: { checker: checkMax },
      maxLength: { checker: checkMaxLength },
      min: { checker: checkMin },
      minLength: { checker: checkMinLength },
    };

    const checkValidity = (input) => {
      const previousValidityStatus = input.validityStatus;
      for (const constraint in input.constraints) {
        if (
          constraint === "required" ||
          input.constraints[constraint].value === false
        )
          return;
        if (
          constraint === "hasValue" &&
          input.constraints[constraint].checker(input) === false
        ) {
          break;
        }
        input.constraints[constraint].checker(input);
      }

      if (input.constraints[required].value === true)
        input.constraints[required].checker(input);

      const unmetConstraints = input.constraints.unmet.length;
      if (input.constraints.unmet.includes("hasValue")) {
        input.validityStatus = "pending";
      } else if (input.constraints.unmet.length === 0) {
        input.validityStatus = "true";
      } else {
        input.validityStatus = "false";
      }

      if (previousValidityStatus !== input.validityStatus) {
        input.el.dispatchEvent(validityStatusChange);
      }
    };

    const removeInvalidConstraint = (el, constraintTag) => {
      const invalidConstraintIndex = el.constraints.unmet.findIndex(
        (el) => el === constraintTag
      );
      if (invalidConstraintIndex !== -1) {
        el.constraints.unmet.splice(invalidConstraintIndex, 1);
      }
    };

    const reportConstraintValidity = (constraint, constraintTag) => {
      if (constraint) {
        removeInvalidConstraint(el, constraintTag);
        return true;
      }
      saveConstraintFailure(el, constraintTag);
      return false;
    };

    const saveConstraintFailure = (input, constraintTag) => {
      input.constraints.unmet.push(constraintTag);
    };

    const createConstraintChecker = ((input, constraint, tag) => {
      return () => {
        reportConstraintValidity(
          input,
          (constraint = constraint),
          (tag = constraint)
        );
      };
    })();

    const checkPattern = createConstraintChecker(
      input,
      input.el.value.test(pattern),
      (tag = "pattern")
    );
    const checkMinLength = createConstraintChecker(
      input,
      input.el.value.length >= minLength,
      (tag = "minLength")
    );
    const checkMaxLength = createConstraintChecker(
      input,
      input.el.value.length <= maxLength,
      (tag = "maxLength")
    );

    const checkType = (input, type, tag = "type") => {
      if (input.type !== type) input.el.type = type;
      reportConstraintValidity(input.el.checkValidity(), tag);
    };

    const checkMin = createConstraintChecker(
      input,
      parseFloat(input.el.value) >= min,
      (tag = "min")
    );
    const checkMax = createConstraintChecker(
      input,
      parseFloat(input.el.value) <= max,
      (tag = "max")
    );
    const checkIfInputHasValue = createConstraintChecker(
      input,
      (input.el.value.trim().length === 0) === false,
      (tag = "hasValue")
    );
    const checkRequired = createConstraintChecker(
      input,
      input.constraints.unmet.length >= 1,
      (tag = "required")
    );
  })();
})();
