function initSelectCTIControls() {
    $('#cti_category').change(debounce(function() {
        $('#cti_type').empty();
        $('#cti_item').empty();
        $('#cti_resolver_group').empty();

        $("#selected_category").val($("#cti_category").val());
        $("#selected_type").val("");
        $("#selected_item").val("");
        $("#selected_resolver_group").val("");

        if ($('#cti_category').val()) {
            populateTypes();
        }
    }, 100));
    $('#cti_type').change(debounce(function() {
        $('#cti_item').empty();
        $('#cti_resolver_group').empty();

        $("#selected_type").val($("#cti_type").val());
        $("#selected_item").val("");
        $("#selected_resolver_group").val("");

        if ($('#cti_type').val()) {
            populateItems();
        }
    }, 100));
    $('#cti_item').change(debounce(function() {
        $('#cti_resolver_group').empty();

        $("#selected_item").val($("#cti_item").val());
        $("#selected_resolver_group").val("");

        if ($('#cti_item').val()) {
            populateResolverGroups();
        }
    }, 100));
    $('#cti_resolver_group').change(debounce(function() {
        $("#selected_resolver_group").val($("#cti_resolver_group").val());
    }, 100));
}

function initRefreshCTI() {
    $('#refresh-cti').click(debounce(function() {
        refreshAllCTI();
    }, 100));
}

/**
 * Check if any CTI/resolver group is empty, then reload the content for this specific CTI/resolver group
 */
function refreshAllCTI() {
    if (isNullEmptyOrUndefined($("#cti_category").val())) {
        $('#cti_type').empty();
        $('#cti_item').empty();
        $('#cti_resolver_group').empty();
        populateCategories();
    } else if (isNullEmptyOrUndefined($("#cti_type").val())) {
        $('#cti_item').empty();
        $('#cti_resolver_group').empty();
        populateTypes();
    } else if (isNullEmptyOrUndefined($("#cti_item").val())) {
        $('#cti_resolver_group').empty();
        populateItems();
    } else if (isNullEmptyOrUndefined($("#cti_resolver_group").val())) {
        populateResolverGroups();
    } else {
        $('#cti_load_error_message').hide();
        $('#refresh-cti').hide();
    }
}

/**
 * Populate the Category select widget
 */
function populateCategories(callbackFunction) {
    var callback;
    if (typeof(callbackFunction) === "undefined") {
        callback = function(categories,textStatus) {
            var $categorySelect = $('<select>');
            $.each(categories, function(idx, val) {
                $categorySelect.append(
                    $("<option>").attr("value", val).text(val)
                );
            });
            $('#cti_category').empty()
                          .append($categorySelect.children())
                          .prepend("<option value='' selected='selected'>- Select -</option>");

            if (!isNullEmptyOrUndefined($("#selected_category").val())) {
                $('#cti_category').val($('#selected_category').val());
                populateTypes();
            } else {
                $('#cti_load_error_message').hide();
                $('#refresh-cti').hide();
            }
        };
    } else {
        callback = callbackFunction;
    }

    $("#select-category-working").show();
    $.ajax({
        url: "/categories",
        type: "GET",
        dataType: "json",
        success: callback
    }).fail(function() {
        $('#cti_load_error_message').show();
        $('#refresh-cti').show();
    }).always(function() {
        $("#select-category-working").hide();
    });
}


function populateTypes(callbackFunction) {
    var callback;
    if (typeof(callbackFunction) === "undefined") {
        callback = function(types,textStatus) {
            var $typeSelect = $('<select>');
            $.each(types, function(idx, val) {
                $typeSelect.append(
                    $("<option>").attr("value", val).text(val)
                );
            });
            // weird here, the following which seems to be doing the same thing does not work (it stills selects the last option):
            // $(#cti_type).empty().append("<option value='' selected='selected''>- Select -</option>")
            //     .append($typeSelect.children())
            $('#cti_type').empty()
                          .append($typeSelect.children())
                          .prepend("<option value='' selected='selected'>- Select -</option>");

            if (!isNullEmptyOrUndefined($("#selected_type").val())) {
                $('#cti_type').val($('#selected_type').val());
                populateItems();
            }else{
                $('#cti_load_error_message').hide();
                $('#refresh-cti').hide();
            }
        };
    } else {
        callback = callbackFunction;
    }

    $("#select-type-working").show();
    $.ajax({
      url: "/types_for_category",
      type: "GET",
      dataType: "json",
      success: callback,
      data: {
          category: $('#cti_category').val()
        }
    }).fail(function() {
        $('#cti_load_error_message').show();
        $('#refresh-cti').show();
    }).always(function() {
        $("#select-type-working").hide();
    });
}


function populateItems(callbackFunction) {
    var callback;
    if (typeof(callbackFunction) === "undefined") {
        callback = function(items,textStatus) {
            var $itemSelect = $('<select>');
            $.each(items, function(idx, val) {
                $itemSelect.append(
                    $("<option>").attr("value", val).text(val)
                );
            });
            $('#cti_item').empty()
                          .append($itemSelect.children())
                          .prepend("<option value='' selected='selected'>- Select -</option>");

            if (!isNullEmptyOrUndefined($("#selected_item").val())) {
                $('#cti_item').val($('#selected_item').val());
                populateResolverGroups();
            } else {
                $('#cti_load_error_message').hide();
                $('#refresh-cti').hide();
            }
        };
    } else {
        callback = callbackFunction;
    }

    $("#select-item-working").show();
    $.ajax({
        url: "/items_for_category_and_type",
        type: "GET",
        dataType: "json",
        success: callback,
        data: {
            category: $('#cti_category').val(),
            type: $('#cti_type').val()
        }
    }).fail(function() {
        $('#cti_load_error_message').show();
        $('#refresh-cti').show();
    }).always(function() {
        $("#select-item-working").hide();
    });
}

function populateResolverGroups(callbackFunction) {
    var callback;
    if (typeof(callbackFunction) === "undefined") {
        callback = function(groups,textStatus) {
            var $groupSelect = $('<select>');
            $.each(groups, function(idx, val) {
                $groupSelect.append(
                    $("<option>").attr("value", val).text(val)
                );
            });
            $('#cti_resolver_group').empty()
                                    .append($groupSelect.children());

            if (groups.length > 1) {
                $('#cti_resolver_group').prepend("<option value='' selected='selected'>- Select -</option>");
                $("#selected_resolver_group").val("");
            } else if (groups.length == 1) {
                $("#selected_resolver_group").val(groups[0]);
            } else {
                $('#cti_resolver_group option').first().attr("selected", "selected");
                $("#selected_resolver_group").val("");
            }

            if (!isNullEmptyOrUndefined($("#selected_resolver_group").val())) {
                 $('#cti_resolver_group').val($('#selected_resolver_group').val());
            }

            $('#cti_load_error_message').hide();
            $('#refresh-cti').hide();
        };
    } else {
        callback = callbackFunction;
    }

    $("#select-resolver-group-working").show();
    $.ajax({
        url: "/resolver_groups_for_cti",
        type: "GET",
        dataType: "json",
        success: callback,
        data: {
            category: $('#cti_category').val(),
            type: $('#cti_type').val(),
            item: $('#cti_item').val()
        }
    }).fail(function() {
        $('#cti_load_error_message').show();
        $('#refresh-cti').show();
    }).always(function() {
        $("#select-resolver-group-working").hide();
    });
};
