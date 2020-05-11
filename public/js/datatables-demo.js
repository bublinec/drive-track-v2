// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
    "order": [[0, "desc"]],
    "bInfo" : false
  });
});

$(document).ready(function() {
  $('#driversTable').DataTable({
    "order": [[0, "desc"]],
    "bInfo" : false,
    "searching": true,
    "bPaginate": false,
    "lengthChange": false
  });
});

$(document).ready(function() {
  $('#addDriversTable').DataTable({
    "order": [[0, "desc"]],
    "bInfo" : false,
    "searching": true,
    "bPaginate": false,
    "lengthChange": false,
    "pageLength": 5
  });
});



