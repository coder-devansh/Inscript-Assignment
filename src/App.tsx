import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const allColumns: string[] = [
    "#", "ABC JOB REQUEST ⬍", "S", "STATUS", "SUBMITTER ⬍", "ASSIGNEE ⬍",
    "PRIORITY ⬍", "DUE DATE ⬍", "BUDGET ⬍", "EST.VALUE ⬍", "URL ⬍"
  ];

  const [visibleCols, setVisibleCols] = useState<string[]>(allColumns);
  const [sortConfig, setSortConfig] = useState<{ key: number | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filters, setFilters] = useState<{ [key: number]: string }>({});
  const [filledRows, setFilledRows] = useState<(React.ReactNode[])[]>([
    ["1", "Q3 Financial Overview", "S", <span className="status in-progress">In-progress</span>, "Asha Patel", "Sophie Choudhury", <span className="priority medium">Medium</span>, "20-11-2024", <span className="amount">₹6,200,000</span>, <span className="amount">₹5,800,000</span>, <a href="https://www.ashapatel.com" target="_blank" rel="noreferrer">www.ashapatel.com</a>],
    ["4", "Update news list for comp...", "S", <span className="status complete">Complete</span>, "Emily Green", "Tom Wright", <span className="priority low">Low</span>, "15-01-2025", <span className="amount">₹6,200,000</span>, <span className="amount">₹6,000,000</span>, <a href="https://www.emilygreen.com" target="_blank" rel="noreferrer">www.emilygreen.com</a>],
    ["2", "Launch marketing campaign...", "S", <span className="status need-to-start">Need to start</span>, "Irfan Khan", "Nisha Pandey", <span className="priority high">High</span>, "30-10-2024", <span className="amount">₹3,500,000</span>, <span className="amount">₹4,200,000</span>, <a href="https://www.irfankhan.com" target="_blank" rel="noreferrer">www.irfankhan.com</a>],
    ["5", "Design new features for t...", "S", <span className="status blocked">Blocked</span>, "Jessica Brown", "Kevin Smith", <span className="priority low">Low</span>, "30-01-2025", <span className="amount">₹2,800,000</span>, <span className="amount">₹3,100,000</span>, <a href="https://www.jessicabrown.com" target="_blank" rel="noreferrer">www.jessicabrown.com</a>],
    ["3", "Update user interface fee...", "S", <span className="status submitted">Submitted</span>, "Maria Martinez", "Rachel Lee", <span className="priority medium">Medium</span>, "10-12-2024", <span className="amount">₹4,750,000</span>, <span className="amount">₹4,500,000</span>, <a href="https://www.mariamartinez.com" target="_blank" rel="noreferrer">www.mariamartinez.com</a>],
    ["6", "Review Q2 Compliance", "S", <span className="status in-progress">In-progress</span>, "Daniel Kim", "Laura Chen", <span className="priority low">Low</span>, "22-12-2024", <span className="amount">₹5,500,000</span>, <span className="amount">₹5,000,000</span>, <a href="https://www.danielkim.com" target="_blank" rel="noreferrer">www.danielkim.com</a>]
  ]);

  const blankRows = 17;

  const toggleColumn = (col: string) => {
    setVisibleCols(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const exportToJSON = (data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spreadsheet-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (callback: (data: any[]) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            const json = JSON.parse(result);
            callback(json);
          } else {
            throw new Error('Invalid file content');
          }
        } catch (err) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSort = () => {
    const col = prompt("Enter column to sort by (exact name):", "#");
    if (!col) return;
    const index = allColumns.indexOf(col);
    if (index === -1) return alert("Invalid column name.");
    const newDirection = sortConfig.key === index && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: index, direction: newDirection });
  };

  const handleFilter = () => {
    const col = prompt("Enter column to filter by (exact name):", "SUBMITTER ⬍");
    const keyword = prompt("Enter keyword to filter:", "");
    if (!col || keyword == null) return;
    const index = allColumns.indexOf(col);
    if (index === -1) return alert("Invalid column name.");
    setFilters({ ...filters, [index]: keyword.toLowerCase() });
  };

  const handleExport = () => {
    const plainData = filledRows.map(row =>
      row.map(cell => {
        if (typeof cell === 'string') return cell;
        if (React.isValidElement(cell)) {
          const props = cell.props as { children?: React.ReactNode };
          if (typeof props.children === 'string') return props.children;
          if (Array.isArray(props.children)) return props.children.join('');
          return '';
        }
        return '';
      })
    );
    exportToJSON(plainData);
  };

  const handleImport = () => {
    importFromJSON((data: any[][]) => {
      const reconstructed = data.map(row => row.map(cell => cell));
      setFilledRows(reconstructed);
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="breadcrumb-wrapper">
          <img src="https://c.animaapp.com/mclmkdkf288FZk/img/panel.svg" className="breadcrumb-icon" alt="panel" />
          <span className="breadcrumbs">Workspace &gt; Folder 5 &gt; <b>Spreadsheet 3</b></span>
        </div>
        <div className="user-profile">
          <input type="text" placeholder="Search within sheet" />
          <span className="notification"></span>
          <span className="username">John Doe</span>
          <span className="avatar">👤</span>
        </div>
      </header>

      <div className="toolbar">
        <div className="toolbar-left">
          <button onClick={() => console.log("toolbar clicked")}> <img src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron-double.svg" alt="toolbar" className="toolbar-image" /> Tool bar</button>
          <button onClick={() => {
            const col = prompt("Enter column title to hide/show:", "STATUS");
            if (col) toggleColumn(col);
          }}> <img src="https://c.animaapp.com/mclmkdkf288FZk/img/eye.svg" alt="hide" className="toolbar-image" /> Hide Fields</button>
          <button onClick={handleSort}>⇅ Sort</button>
          <button onClick={handleFilter}>🔍 Filter</button>
        </div>
        <div className="toolbar-right">
          <button onClick={handleImport}>⬆️ Import</button>
          <button onClick={handleExport}>⬇️ Export</button>
          <button>🔗 Share</button>
          <button className="new-action">+ New Action</button>
        </div>
      </div>

      <div className="grid-bar">
        <span>Showing {filledRows.length} of {filledRows.length} job requests</span>
        <div className="grid-controls">
          <button>{'<'}</button>
          <button>{'>'}</button>
          <button className="grid-view" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
            {viewMode === 'table' ? '📄 Grid View' : '📊 Table View'}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        {viewMode === 'table' ? (
          <table>
            <thead>
              <tr>
                {allColumns.map((col, i) => (
                  visibleCols.includes(col) && <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filledRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    visibleCols.includes(allColumns[cIdx]) && <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
              {Array.from({ length: blankRows }).map((_, i) => (
                <tr key={`blank-${i}`}>
                  {allColumns.map((col, cIdx) => visibleCols.includes(col) && <td key={cIdx}></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid-view-wrapper">
            {filledRows.map((row, rIdx) => (
              <div className="grid-card" key={rIdx}>
                {row.map((cell, cIdx) => (
                  visibleCols.includes(allColumns[cIdx]) && (
                    <div className="grid-cell" key={cIdx}>
                      <strong>{allColumns[cIdx]}:</strong> {cell}
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <span>All Orders</span>
        <button className="pending">Pending</button>
        <button className="Reviewed">Reviewed</button>
        <button className="Arrived">Arrived</button>
      </footer>
    </div>
  );
};

export default App;
