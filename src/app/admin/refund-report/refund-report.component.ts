import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GenerateReportService } from '../services/generate-report.service';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Chart, registerables } from 'chart.js'
import autoTable from 'jspdf-autotable';;

@Component({
    selector: 'app-refund-report',
    templateUrl: './refund-report.component.html',
    styleUrls: ['./refund-report.component.scss'],
    standalone: false
})
export class RefundReportComponent implements OnInit {

  @ViewChild('refundedMerchantChart', { static: true }) refundedMerchantChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reportContent', { static: false }) reportContent!: ElementRef;

  refundedPercentage: number = 0;
  totalRefundedAmount: number = 0;
  refundedDetails: any[] = [];

  constructor(
    private reportService: GenerateReportService
  ) {}

  ngOnInit(): void {
    this.fetchRefundedMerchantData();
  }

  fetchRefundedMerchantData(): void {
    this.reportService.getRefundedMerchantData().subscribe(
      (data: any) => {
        if (data && data.refundedPercentage !== undefined && data.totalRefundedAmount !== undefined && data.refundedDetails !== undefined) {
          this.refundedPercentage = data.refundedPercentage;
          this.totalRefundedAmount = data.totalRefundedAmount;
          this.refundedDetails = data.refundedDetails;
          this.initializeRefundedMerchantChart();
        } else {
          console.error('Invalid data received from API:', data);
          this.refundedPercentage = 0;
          this.totalRefundedAmount = 0;
          this.refundedDetails = [];
        }
      },
      (error) => {
        console.error('Error fetching refunded data:', error);
        this.refundedPercentage = 0;
        this.totalRefundedAmount = 0;
        this.refundedDetails = [];
      }
    );
  }

  adjustCanvasResolution(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    const context = canvas.getContext('2d');
    if (context) {
      const devicePixelRatio = window.devicePixelRatio || 1;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;

      context.scale(devicePixelRatio, devicePixelRatio);
    }
    return context;
  }

  initializeRefundedMerchantChart(): void {
    const context = this.adjustCanvasResolution(this.refundedMerchantChartCanvas.nativeElement);
    if (context) {
      new Chart(context, {
        type: 'doughnut',
        data: {
          labels: ['Refunded', 'Remaining'],
          datasets: [
            {
              data: [this.refundedPercentage, 100 - this.refundedPercentage],
              backgroundColor: ['#023040', '#E0E0E0'],
              hoverBackgroundColor: ['#FF6384', '#F5F5F5'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label;
                  const value = context.raw;
                  return `${label}: ${value}%`;
                },
                footer: () =>
                  `Total Refunded: PHP ${this.totalRefundedAmount.toLocaleString()}`,
              },
            },
          },
          rotation: -90,
          circumference: 180,
        },
      });
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();
  
    const logoImage = './logo.png';
    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 25;
    const logoHeight = 25;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 10;
    try {
      doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  
    const description = 'Philippine Tourist Destination Information System and Booking Management Platform';
    const descriptionFontSize = 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(descriptionFontSize);
    const descriptionX = (pageWidth - doc.getTextWidth(description)) / 2;
    const descriptionY = logoY + logoHeight + 10;
    doc.text(description, descriptionX, descriptionY);
  
    const reportTitle = 'Refunded Merchant Report';
    doc.setFont('helvetica', 'bold');
    const titleFontSize = 12;
    const titleX = (pageWidth - doc.getTextWidth(reportTitle)) / 2;
    const titleY = descriptionY + 10;
    doc.text(reportTitle, titleX, titleY);
  
    try {
      const chartImage = this.refundedMerchantChartCanvas.nativeElement.toDataURL('image/png');
      if (chartImage) {
        doc.addImage(chartImage, 'PNG', 14, titleY + 10, 180, 90);
      }
    } catch (error) {
      console.error('Error capturing chart image:', error);
    }
  
    let yOffset = titleY + 110;
    const refundedPercentageText = `Refunded Percentage: ${this.refundedPercentage}%`;
    const totalRefundedAmountText = `Total Refunded Amount: PHP ${this.totalRefundedAmount.toLocaleString()}`;
    doc.setFontSize(10);
    doc.text(refundedPercentageText, 10, yOffset);
    doc.text(totalRefundedAmountText, 10, yOffset + 10);
    yOffset += 20;
  
    const table = document.querySelector('.table-box') as HTMLTableElement;
    if (table) {
      const rows = table.querySelectorAll('tr');
      const headers = Array.from(rows[0].cells).map((cell: HTMLTableCellElement) => cell.textContent);
      const tableData = Array.from(rows).slice(1, 20).map((row: HTMLTableRowElement) => {
        return Array.from(row.cells).map((cell: HTMLTableCellElement) => cell.textContent);
      });
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: yOffset,
        theme: 'grid',
        styles: { fontSize: 8, halign: 'center' },
      });
    }
  
    doc.save('Refunded_Merchant_Report.pdf');
  }
  
  
  
  
  exportToExcel(): void {
    const table = document.querySelector('.table-box') as HTMLTableElement;
  
    if (!table) {
      console.error('Table not found!');
      return;
    }
  
    const rows = table.querySelectorAll('tr');
  
    const limitedRows = Array.from(rows).slice(0, 20);
  
    const tempTable = document.createElement('table');
    limitedRows.forEach(row => {
      tempTable.appendChild(row.cloneNode(true));
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tempTable);
  
    const title = [
      ['REFUNDED MERCHANT REPORT'], 
      [`Total Refunded Amount: PHP ${this.totalRefundedAmount.toLocaleString()}`],
      [`Refunded Percentage: ${this.refundedPercentage}%`],
      [], 
    ];
  
    XLSX.utils.sheet_add_aoa(ws, title, { origin: 'A1' });
  
    const maxColWidths: number[] = []; 
  
    Object.keys(ws).forEach(cell => {
      if (cell[0] === '!') return; 
      const colIndex = parseInt(cell.replace(/\D/g, ''), 10); 
      const value = ws[cell]?.v || ''; 
      maxColWidths[colIndex] = Math.max(maxColWidths[colIndex] || 0, value.toString().length + 2); 
    });
  
    ws['!cols'] = maxColWidths.map(width => ({ wch: width }));
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Refunded Merchants');
  
    XLSX.writeFile(wb, 'Refunded_Merchant_Report.xlsx');
  }
  
  
}  