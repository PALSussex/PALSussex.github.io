// $Id: popup_help.js,v 1.4 2004/08/24 13:39:36 johnw Exp $

function popup_help(formlet, title) {
  win=open(
    "help.php?formlet=" + formlet + '&title=' + title, formlet,
    "dependent=yes,scrollbars=yes,resizable=yes,width=550,height=450"
  );
  win.focus();
}
