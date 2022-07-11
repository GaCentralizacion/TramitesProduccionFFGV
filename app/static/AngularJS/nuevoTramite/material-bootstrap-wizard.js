/*!

 =========================================================
 * Material Bootstrap Wizard - v1.0.2
 =========================================================
 
 * Product Page: https://www.creative-tim.com/product/material-bootstrap-wizard
 * Copyright 2017 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-bootstrap-wizard/blob/master/LICENSE.md)
 
 =========================================================
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// Material Bootstrap Wizard Functions

var searchVisible = 0;
var transparent = true;
var mobile_device = false;
var tpersona = "";
$(document).ready(function() {

    $.material.init();


    /*  Activate the tooltips      */
    var rule = {};
    var $validator;
    $validator = $('.wizard-card form').validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3
            }
        },

        errorPlacement: function(error, element) {
            $(element).parent('div').addClass('has-error');
        }
    });


    $('[rel="tooltip"]').tooltip();
    $("#fis").click(function() {
        $validator.destroy();

        tpersona = "FIS";
        rule = {
            nombre: {
                required: true,
                minlength: 3
            },
            paterno: {
                required: true,
                minlength: 3
            },
            materno: {
                required: true,
                minlength: 3
            },
            rfc: {
                required: true,
                minlength: 12
            },
            calle: {
                required: true,
                minlength: 3
            },
            exterior: {
                required: true,
                minlength: 1
            },
            colonia: {
                required: true,
                minlength: 3
            },
            cp: {
                required: true,
                minlength: 3
            },
            localidad: {
                required: true,
                minlength: 3
            },
            ciudad: {
                required: true,
                minlength: 3
            },
            telefono: {
                required: true,
                minlength: 3
            },
            giro: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                minlength: 3
            }
        }
        /* Code*/
        /* for the Validator*/
        $validator = $('.wizard-card form').validate({
            rules: rule,

            errorPlacement: function(error, element) {
                $(element).parent('div').addClass('has-error');
            }
        });
    });

    $("#mor").click(function() {
        $validator.destroy();
        tpersona = "MOR";
        rule = {
            nombre: {
                required: true,
                minlength: 3
            },
            rfc: {
                required: true,
                minlength: 12
            },
            calle: {
                required: true,
                minlength: 3
            },
            exterior: {
                required: true,
                minlength: 1
            },
            colonia: {
                required: true,
                minlength: 3
            },
            cp: {
                required: true,
                minlength: 3
            },
            localidad: {
                required: true,
                minlength: 3
            },
            ciudad: {
                required: true,
                minlength: 3
            },
            telefono: {
                required: true,
                minlength: 3
            },
            giro: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                minlength: 3
            }
        }
        /* Code*/
        /* for the Validator*/
        $validator = $('.wizard-card form').validate({
            rules: rule,

            errorPlacement: function(error, element) {
                $(element).parent('div').addClass('has-error');
            }
        });

    });

    $(".breadcrumb > li").click(function() {
        //Busca todos los elementos del breadcrumb que tengan la clase active y los elimina
        $(this).closest('.breadcrumb').find('li').removeClass('active-breadcrumb');
        //Al elemento seleccionado agrega la clase active-breadcrumb
        $(this).addClass('active-breadcrumb');
    });





    // Wizard Initialization
    $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function(tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();
            if (!$valid || !tpersona) {
                $validator.focusInvalid();
                return false;
            }
        },

        onInit: function(tab, navigation, index) {
           
            //check number of tabs and fill the entire row
            var $total = navigation.find('li').length;
            var $wizard = navigation.closest('.wizard-card');

            $first_li = navigation.find('li:first-child a').html();
            $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
            $('.wizard-card .wizard-navigation').append($moving_div);

            refreshAnimation($wizard, index);

            $('.moving-tab').css('transition', 'transform 0s');
        },

        onTabClick: function(tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();

            if (!$valid || !tpersona) {
                $validator.focusInvalid();
                return false;
            } else {
                return true;
            }
        },

        onTabShow: function(tab, navigation, index) {



            var $total = navigation.find('li').length;
            var $current = index + 1;




            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead
            if ($current >= $total) {

                $($wizard).find('.btn-next').hide();
                if ($('#terminar').val() == 1) {
                    $($wizard).find('.btn-finish').show();
                }


            } else {


                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            button_text = navigation.find('li:nth-child(' + $current + ') a').html();

            setTimeout(function() {
                $('.moving-tab').text(button_text);
            }, 150);

            var checkbox = $('.footer-checkbox');

            if (!index == 0) {
                $(checkbox).css({
                    'opacity': '0',
                    'visibility': 'hidden',
                    'position': 'absolute'
                });
            } else {
                $(checkbox).css({
                    'opacity': '1',
                    'visibility': 'visible'
                });
            }

            refreshAnimation($wizard, index);
        }
    });


    // Prepare the preview for profile picture
    $("#wizard-picture").change(function() {
        readURL(this);
    });

    $('[data-toggle="wizard-radio"]').click(function() {
        wizard = $(this).closest('.wizard-card');
        wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
        $(this).addClass('active');
        $(wizard).find('[type="radio"]').removeAttr('checked');
        $(this).find('[type="radio"]').attr('checked', 'true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).find('[type="checkbox"]').removeAttr('checked');
        } else {
            $(this).addClass('active');
            $(this).find('[type="checkbox"]').attr('checked', 'true');
        }
    });

    $('.set-full-height').css('height', 'auto');

});



//Function to show image before upload

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(window).resize(function() {
    $('.wizard-card').each(function() {
        $wizard = $(this);

        index = $wizard.bootstrapWizard('currentIndex');
        refreshAnimation($wizard, index);

        $('.moving-tab').css({
            'transition': 'transform 0s'
        });
    });
});

function refreshAnimation($wizard, index) {
    $total = $wizard.find('.nav li').length;
    $li_width = 100 / $total;

    total_steps = $wizard.find('.nav li').length;
    move_distance = $wizard.width() / total_steps;
    index_temp = index;
    vertical_level = 0;

    mobile_device = $(document).width() < 600 && $total > 3;

    if (mobile_device) {
        move_distance = $wizard.width() / 2;
        index_temp = index % 2;
        $li_width = 50;
    }

    $wizard.find('.nav li').css('width', $li_width + '%');

    step_width = move_distance;
    move_distance = move_distance * index_temp;

    $current = index + 1;

    if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
        move_distance -= 8;
    } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
        move_distance += 8;
    }

    if (mobile_device) {
        vertical_level = parseInt(index / 2);
        vertical_level = vertical_level * 38;
    }

    $wizard.find('.moving-tab').css('width', step_width);
    $('.moving-tab').css({
        'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

    });
}

materialDesign = {

    checkScrollForTransparentNavbar: debounce(function() {
        if ($(document).scrollTop() > 260) {
            if (transparent) {
                transparent = false;
                $('.navbar-color-on-scroll').removeClass('navbar-transparent');
            }
        } else {
            if (!transparent) {
                transparent = true;
                $('.navbar-color-on-scroll').addClass('navbar-transparent');
            }
        }
    }, 17)

}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};