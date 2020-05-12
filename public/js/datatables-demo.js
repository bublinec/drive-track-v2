// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
    "order": [[0, "desc"]],
    "bInfo" : false,
    "language": {emptyTable: "Add ride using form above."}
  });
});

$(document).ready(function() {
  $('#driversTable').DataTable({
    "order": [[0, "desc"]],
    "bInfo" : false,
    "searching": true,
    "bPaginate": false,
    "lengthChange": false,
    "language": {emptyTable: "Click + in the header to add driver."}
  });
});

$(document).ready(function() {
  $('#addDriversTable').DataTable({
    "order": [[0, "desc"]],
    "bInfo" : false,
    "searching": true,
    "bPaginate": false,
    "lengthChange": false,
    "pageLength": 5,
    "language": {emptyTable: "You have already added all drivers."}
  });
});



