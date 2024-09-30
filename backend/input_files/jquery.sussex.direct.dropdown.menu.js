/**
 * $Id: jquery.sussex.direct.dropdown.menu.js 11290 2011-04-14 23:48:18Z apc23 $
 */

var idSxDNavTimer;

function closeSxDNavMenu() {
  /*  $('select, input').show(); */
    $('.sub_nav_2').hide();
    $('.sub_nav_active').removeClass('sub_nav_active');
    $('.sub_nav_first_link_active').removeClass('sub_nav_first_link_active');
}

$(function() {
    $('#sub_nav_dropdown ul li a').click(function() {
/*
        if (jQuery.browser.msie) {
            if (parseInt(jQuery.browser.version) == 6) {
                $('select, input').hide();
            }
        }
*/
        if (typeof idSxDNavTimer != undefined) {
            clearTimeout(idSxDNavTimer);
        }
        var name = $(this).attr('id').substring(8);
        $('#sub_nav_2_' + name).css('left', ($(this).position().left)-1);
        $('.sub_nav_2').slideUp(100);
        $('.sub_nav_3').slideUp(100);
        $('.sub_nav_2_active').removeClass('sub_nav_2_active');
        $('#sub_nav_2_' + name).slideDown(80);
        $('.sub_nav_first_link_active').removeClass('sub_nav_first_link_active');
        $('.sub_nav_active').removeClass('sub_nav_active');
        if ($(this).hasClass('sub_nav_first_link')) {
            $(this).addClass('sub_nav_first_link_active');
        } else {
            $(this).addClass('sub_nav_active');
        }
        return false;
    });
    $('#sub_nav_dropdown ul li, .sub_nav_2').hover(
        function() {
            if (typeof idSxDNavTimer != undefined) {
                clearTimeout(idSxDNavTimer);
            }
        },
        function() {
            idSxDNavTimer = setTimeout('closeSxDNavMenu()', 150);
        }
    );
    $('.sub_nav_2 ul li a.sub_nav.nogo').click(function() {
        var name = $(this).attr('id').substring(10);
        $('#sub_nav_3_' + name).toggle(200);
        $('.sub_nav_2_active').removeClass('sub_nav_2_active');
        $(this).addClass('sub_nav_2_active');
    });
});