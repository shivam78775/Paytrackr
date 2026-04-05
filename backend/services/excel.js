import ExcelJS from 'exceljs';
import { format } from 'date-fns';

export const generateDuesExcel = async (dues, filenamePrefix = 'pending-dues') => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Dues Report');

    sheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Phone Number', key: 'phoneNumber', width: 15 },
        { header: 'Item Purchased', key: 'item', width: 20 },
        { header: 'Bill Number', key: 'billNumber', width: 15 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Due Date', key: 'dueDate', width: 15 },
        { header: 'Return Date', key: 'expectedReturnDate', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Remark', key: 'remark', width: 30 }
    ];

    // Style the header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    dues.forEach(due => {
        sheet.addRow({
            name: due.name,
            phoneNumber: due.phoneNumber,
            item: due.item || '-',
            billNumber: due.billNumber || '-',
            amount: due.amount,
            dueDate: due.dueDate ? format(new Date(due.dueDate), 'dd-MM-yyyy') : '-',
            expectedReturnDate: due.expectedReturnDate ? format(new Date(due.expectedReturnDate), 'dd-MM-yyyy') : '-',
            status: due.status.toUpperCase(),
            remark: due.remark || '-'
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

export const generateStitchingExcel = async (records, filenamePrefix = 'stitching-report') => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Stitching Report');

    sheet.columns = [
        { header: 'Customer Name', key: 'customerName', width: 25 },
        { header: 'Phone Number', key: 'phoneNumber', width: 15 },
        { header: 'Cloth Type', key: 'clothType', width: 20 },
        { header: 'Bill Number', key: 'billNumber', width: 15 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Order Date', key: 'orderDate', width: 15 },
        { header: 'Delivery Date', key: 'deliveryDate', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Remark', key: 'remark', width: 30 }
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    records.forEach(record => {
        sheet.addRow({
            customerName: record.customerName,
            phoneNumber: record.phoneNumber,
            clothType: record.clothType,
            billNumber: record.billNumber || '-',
            amount: record.amount,
            orderDate: record.orderDate ? format(new Date(record.orderDate), 'dd-MM-yyyy') : '-',
            deliveryDate: record.deliveryDate ? format(new Date(record.deliveryDate), 'dd-MM-yyyy') : '-',
            status: record.status.toUpperCase(),
            remark: record.remark || '-'
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};
