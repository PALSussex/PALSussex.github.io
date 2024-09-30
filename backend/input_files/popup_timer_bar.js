// $Id: popup_timer_bar.js,v 1.1 2006/12/07 13:16:49 johnw Exp $

var timer_bar_window = 0;

function popup_timer_bar() {
    var url = "src/timer_bar_wait.html";
    var width = 240; 
    var height = 80; 

    timer_bar_window = window.open(url, "timer_bar_window",
      "dependent=1,width=" + width + ",height=" + height);

    win = timer_bar_window.opener
    x = win.screenX + (win.innerWidth / 2) - (width / 2);
    y = win.screenY + (win.innerWidth / 2) - (height / 2);
    timer_bar_window.moveTo(x, y);
}

function timer_bar_close() {
  if (timer_bar_window && timer_bar_window.closed == false) {
    timer_bar_window.close();
  }
}
