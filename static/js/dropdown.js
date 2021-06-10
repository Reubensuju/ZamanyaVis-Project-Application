$(document).ready(function() {

    $("#datatype").change(function() {
        var val = $(this).val();
        if (val == "Body") {
            $("#attribute").html("<option value='Weight'>Weight</option><option value='BMI'>BMI</option><option value='Fat'>Fat</option>");
        } else if (val == "Foods") {
            $("#attribute").html("<option value='Calories In'>Calories In</option>");

        } else if (val == "Activities") {
            $("#attribute").html("<option value='Calories Burned'>Calories Burned</option><option value='Steps'>Steps</option><option value='Distance'>Distance</option><option value='Floors'>Floors</option><option value='Minutes Sedentary'>Minutes Sedentary</option><option value='Minutes Lightly Active'>Minutes Lightly Active</option><option value='Minutes Fairly Active'>Minutes Fairly Active</option><option value='Minutes Very Active'>Minutes Very Active</option><option value='Activity Calories'>Activity Calories</option>");
        } else if (val == "Sleep") {
            $("#attribute").html("<option value='Minutes Asleep'>Minutes Asleep</option><option value='Minutes Awake'>Minutes Awake</option>");
        }
    });


});