import * as XLSX from 'xlsx';

export const excelService = {
  generateRevenueReport: (orgName, events, totalRegistrations, totalRevenue) => {
    // Prepare data for the report
    const reportData = [];

    // Add header
    reportData.push(['Organization Revenue Report']);
    reportData.push([]);
    reportData.push(['Organization Name:', orgName]);
    reportData.push(['Report Generated:', new Date().toLocaleDateString()]);
    reportData.push(['Total Events:', events.length]);
    reportData.push(['Total Registrations:', totalRegistrations]);
    reportData.push(['Total Revenue:', `$${totalRevenue.toFixed(2)}`]);
    reportData.push([]);

    // Add event details header
    reportData.push([
      'Event Name',
      'Date',
      'Location',
      'Status',
      'Ticket Price',
      'Registrations',
      'Event Revenue'
    ]);

    // Add event data
    events.forEach(event => {
      const eventRevenue = event.ticket_price > 0 
        ? (event.ticket_price * (event.registrationCount || 0)).toFixed(2)
        : '0.00';
      
      reportData.push([
        event.event_name,
        new Date(event.event_date).toLocaleDateString(),
        event.location,
        event.event_status,
        `$${event.ticket_price}`,
        event.registrationCount || 0,
        `$${eventRevenue}`
      ]);
    });

    // Create workbook
    const ws = XLSX.utils.aoa_to_sheet(reportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 25 },  // Event Name
      { wch: 12 },  // Date
      { wch: 20 },  // Location
      { wch: 12 },  // Status
      { wch: 12 },  // Ticket Price
      { wch: 12 },  // Registrations
      { wch: 15 }   // Event Revenue
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Revenue Report');

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const filename = `${orgName}_Revenue_Report_${date}.xlsx`;

    // Download the file
    XLSX.writeFile(wb, filename);
  }
};
