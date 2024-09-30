// $Id: compress_formlet.js,v 1.4 2016/11/28 16:42:15 johnw Exp $

function compress_formlet(table_id, img_id, text) {
  var table, border_id, title_id, subtitle_id, rows, c;
  table = document.getElementById(table_id);
  border_id = table_id.replace("_table", "_border");
  title_id = table_id.replace("_table", "_title");
  subtitle_id = table_id.replace("_table", "_subtitle");
  rows = table.rows;
  if (rows[0].style.display == 'none') {
    // open formlet
    for (i = 0; i < rows.length; i++) {
      rows[i].style.display = ""; // not table-row as doesn't work in IE7
    }
    document.getElementById(img_id).src = "images/compress.gif";
    // document.getElementById(img_id).title = "Compress";
    document.getElementById(border_id).style.borderColor = "#18637A";
    document.getElementById(border_id).style.backgroundColor = "#18637A";
    document.getElementById(title_id).style.backgroundColor = "#18637A";
    if (document.getElementById(subtitle_id)){
      document.getElementById(subtitle_id).style.display = "block";
    }
    table.deleteCaption();
  }
  else {
    // close formlet
    for (i = 0; i < rows.length; i++) {
      rows[i].style.display = 'none';
    }
    document.getElementById(img_id).src = "images/expand.gif";
    // document.getElementById(img_id).title = "Expand";
    document.getElementById(border_id).style.borderColor = "#c2d1d4";
    document.getElementById(border_id).style.backgroundColor = "#c2d1d4";
    document.getElementById(title_id).style.backgroundColor = "#c2d1d4";
    if (document.getElementById(subtitle_id)) {
      document.getElementById(subtitle_id).style.display = "none";
    }
    c = table.createCaption();
    c.className = "formlet_closed";
    c.align = "bottom"; // for IE7
    c.innerHTML = text.link(
      "javascript:compress_formlet('" 
       + table_id + "','" + img_id + "','" + text + "');"
     );
  }
}
