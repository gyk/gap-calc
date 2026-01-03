# Project Plan: gap-calc UI Improvements

- [x] In the "Flat Pace/Speed" section, there is a selector for "Pace" vs. "Speed", but the input
    has four modes: "/km", "/mi", "km/h", "mph". So the selector for "Pace" vs. "Speed" is redundant
    and confusing. Consider removing it and just using the four input modes, and displays "Flat
    Pace"  or "Flat Speed" accordingly.
- [x] In the "Hill Settings", there is a selector for "uphill" vs. "downhill". But when setting the
    grade to negative, it automatically means downhill. So the selector is redundant and confusing.
    Consider removing it, and use the image indicator is original gap-app to indicate uphill vs.
    downhill.

    ```html
    <button class="material-symbols-outlined hill-button" title="Uphill or downhill" aria-label="Toggle uphill or downhill">
    elevation
    </button>
    <button class="material-symbols-outlined hill-button mirrored" title="Uphill or downhill" aria-label="Toggle uphill or downhill">
    elevation
    </button>
    ```

    But we don't use material icons in this project, so we need to find another way to do it (SVG or
    other clever ways).
- [x] In the original app, the grade UI is like, where `<<` `<` `>` `>>` are circle buttons:

    ```
    << <     Grade: 5%     > >>
    ```

    It allows users to click the arrows to increment/decrement the grade value, either using small
    or large steps. Consider implementing a similar UI, or use a slider.
- [x] The output "Grade-Adjusted Pace" card in not horizontally centered.
- [x] Consider adding an option to switch between Metric / Imperial / Both units for all inputs and
  outputs. Make metric the default. Make "km/h" the default output unit.
