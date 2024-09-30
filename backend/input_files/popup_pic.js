// $Id: popup_pic.js,v 1.3 2013/09/04 15:47:06 johnw Exp $

function popup_pic(img) {
  img = "showfile.php?file=" + img;
  win=open(img, "_blank", "scrollbars=no,resizable=yes,width=240,height=320");
  win.focus();
}
