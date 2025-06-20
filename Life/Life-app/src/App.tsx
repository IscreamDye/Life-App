import "./App.css";
import { useState } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, } from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

type ModalStep = null | "category" | "counter" | "graph" | "textbox";

interface Counter {
  title: string;
  value: number;
}

interface Notes {
  title: string;
  enteries: string[];
}

interface ChartEntry {
  date: string;
  value: number;
  showDelete?: boolean;
}

interface ChartData {
  title: string;
  entries: ChartEntry[];
}

function App() {
  const [modalStep, setModalStep] = useState<ModalStep>(null);

  const [newCounterTitle, setNewCounterTitle] = useState("");
  const [counters, setCounters] = useState<Counter[]>([]);

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [notes, setNotes] = useState<Notes[]>([]);

  const [newChartTitle, setNewChartTitle] = useState("");
  const [charts, setCharts] = useState<ChartData[]>([]);

  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [noteEntryText, setNoteEntryText] = useState("");

  const [editingChartIndex, setEditingChartIndex] = useState<number | null>(null);
  const [chartValueInput, setChartValueInput] = useState("");

 
  const [showCounters, setShowCounters] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [showNotes, setShowNotes] = useState(false);


  const incrementCounter = (index: number) => {
    setCounters((prev) =>
      prev.map((counter, i) =>
        i === index ? { ...counter, value: counter.value + 1 } : counter
      )
    );
  };

  const decrementCounter = (index: number) => {
    setCounters((prev) =>
      prev.map((counter, i) =>
        i === index ? { ...counter, value: counter.value - 1 } : counter
      )
    );
  };

  const resetCounter = (index: number) => {
    setCounters((prev) =>
      prev.map((counter, i) =>
        i === index ? { ...counter, value: counter.value = 0 } : counter
      )
    );
  };

  

  const handleAddCounter = () => {
    if (!newCounterTitle.trim()) return;
    setCounters([...counters, { title: newCounterTitle, value: 0 }]);
    setNewCounterTitle("");
    setModalStep(null);
  };

  const handleNotes = () => {
    setNotes([...notes, { title: newNoteTitle, enteries: [] }]);
    setNewNoteTitle("");
    setModalStep(null);
  };

  const handleAddChart = () => {
    if (!newChartTitle.trim()) return;
    setCharts([...charts, { title: newChartTitle, entries: [] }]);
    setNewChartTitle("");
    setModalStep(null);
  };

  const formatDate = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getFullYear()).slice(-2)}`;
  };



  const [selectedChartPoint, setSelectedChartPoint] = useState<{
    chartIndex: number;
    entryIndex: number;
  } | null>(null);

  const [editChartEntryValue, setEditChartEntryValue] = useState("");

  

  return (
    <div className="main-container">
      <h1>My Life in Stats</h1>
      <button className="lifebtn" onClick={() => setModalStep("category")}>Add Life Tracker</button>
        <div className="container">
                {/* -------------------Counters----------------- */}
                {showCounters &&(
                    <div className="counter-section">
                      {counters.map((counter, index) => (
                        <div className="simplecounter" key={`counter-${index}`}>
                          <div className="card">
                            <div className="ctitle">
                              <h2>{counter.title}</h2>
                              <div className="cdelete">
                                <button className="redsmall" onClick={() => setCounters((prev) => prev.filter((_, i) => i !== index))}>x</button>
                              </div>
                            </div>
                            
                            <p>{counter.value}</p>
                            <button className="red" onClick={() => decrementCounter(index)}>-</button>
                            <button className="reset" onClick={() => resetCounter(index)}>Reset</button>
                            <button className="green" onClick={() => incrementCounter(index)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                )}
              
              {/* -------------------Charts ----------------- */}
              {showCharts &&(
                  <div className="chart-section">
                      {charts.map((chart, index) => (
                        <div className="card" key={`chart-${index}`}>
                          <h3>{chart.title}</h3>
                          <Line
                            data={{
                              labels: chart.entries.map((e) => e.date),
                              datasets: [
                                {
                                  data: chart.entries.map((e) => e.value),
                                  fill: false,
                                  borderColor: "rgb(75, 192, 192)",
                                  tension: 0.1,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: {
                                  display: false, // Hides the legend
                                },
                                tooltip: {
                                  displayColors: false, // Hides the colored square
                                  callbacks: {
                                    label: (context) => `${context.formattedValue}`, // Just the value
                                  },
                                },
                              },
                              onClick: (_, elements) => {
                                if (elements.length > 0) {
                                  const chartElement = elements[0];
                                  const dataIndex = chartElement.index;
                                  setSelectedChartPoint({ chartIndex: index, entryIndex: dataIndex });
                                }
                              },
                            }}
                          />


                          <div className="notebuttons">
                            <button className="red" onClick={() => setCharts((prev) => prev.filter((_, i) => i !== index))}>
                              Delete Chart
                            </button>
                            <button className="green" onClick={() => setEditingChartIndex(index)}>
                              Add Entry
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
              )}
                  
          {/* -------------------To do list ----------------- */}
          {showNotes &&(
            <div className="notes-section">
                  {notes.map((note, index) => (
                    <div className="simplecounter" key={`note-${index}`}>
                      <div className="notecard">
                        <div className="notecontainer">
                          <h3>{note.title}</h3>
                          <ul>
                            {note.enteries.map((entry, entryIndex) => (
                              <li key={`entry-${entryIndex}`}>
                                <span>{entry}</span>
                                <button className="red" onClick={() => setNotes((prev) => prev.map((n, noteIdx) => noteIdx === index
                                  ? { ...n, enteries: n.enteries.filter((_, i) => i !== entryIndex) }
                                  : n
                                )
                                )
                                }>
                                  X
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="notebuttons">
                          <button className="red" onClick={() => setNotes((prev) => prev.filter((_, i) => i !== index))}>
                            Delete Note
                          </button>
                          <button className="green" onClick={() => setEditingNoteIndex(index)}>
                            Add Entry
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
          )}
              
      </div>
      {/* ------------Lower panel ---------------------- */}
      <div className="lowerpanel">
        <button className="green" onClick={() => {setShowCounters(true); setShowCharts(false); setShowNotes(false);}}>Counters</button>
        <button className="green" onClick={() => {setShowCounters(false); setShowCharts(true); setShowNotes(false);}}>Charts</button>
        <button className="green" onClick={() => {setShowCounters(false); setShowCharts(false); setShowNotes(true);}}>To do Lists</button>
      </div>
        {/* ------------Select Tracker ---------------------- */}
        {modalStep === "category" && (
          <div className="modal">
            <div className="modalcontainer">
              <h2>Select a Tracker Type</h2>
              <button onClick={() => setModalStep("counter")}>Simple Counter</button>
              <button onClick={() => setModalStep("graph")}>Chart Tracker</button>
              <button onClick={() => setModalStep("textbox")}>To do List</button>
              <button onClick={() => setModalStep(null)}>Close</button>
            </div>
          </div>
        )}
        {/* ------------Counter Selected ---------------------- */}
      {modalStep === "counter" && (
        <div className="modal">
          <div className="modalcontainer">
            <h2>Create Counter</h2>
            <input type="text" placeholder="Counter name" value={newCounterTitle} onChange={(e) => setNewCounterTitle(e.target.value)} />
            <button onClick={handleAddCounter}>Add</button>
            <button onClick={() => setModalStep("category")}>Back</button>
          </div>
        </div>
      )}
      {/* ------------To do list Selected ---------------------- */}
      {modalStep === "textbox" && (
        <div className="modal">
          <div className="modalcontainer">
            <h2>Title name</h2>
            <input type="text" placeholder="Title name" value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} />
            <button onClick={handleNotes}>Add</button>
            <button onClick={() => setModalStep("category")}>Back</button>
          </div>
        </div>
      )}
      {/* ------------Add entry for to do ---------------------- */}
      {editingNoteIndex !== null && (
        <div className="modal">
          <div className="modalcontainer">
            <h2>Add Entry for: {notes[editingNoteIndex].title}</h2>
            <textarea placeholder="Write your entry..." value={noteEntryText} onChange={(e) => setNoteEntryText(e.target.value)} />
            <button onClick={() => {
              setNotes((prev) => prev.map((note, idx) => idx === editingNoteIndex ?
                { ...note, enteries: [...note.enteries, noteEntryText] } : note));
              setNoteEntryText("");
              setEditingNoteIndex(null);
            }}> Save </button>
            <button onClick={() => setEditingNoteIndex(null)}>Cancel</button>
          </div>
        </div>
      )}
      {/* ------------Chart Selected ---------------------- */}
      {modalStep === "graph" && (
        <div className="modal">
          <div className="modalcontainer">
            <h2>Create Chart</h2>
            <input type="text" placeholder="Chart title" value={newChartTitle} onChange={(e) => setNewChartTitle(e.target.value)} />
            <button onClick={handleAddChart}>Add</button>
            <button onClick={() => setModalStep("category")}>Back</button>
          </div>
        </div>
      )}
    {/* ------------Add entry for chart ---------------------- */}
      {editingChartIndex !== null && (
        <div className="modal">
          <div className="modalcontainer">
            <h2>Add Chart Entry: {charts[editingChartIndex].title}</h2>
            <input type="number" placeholder="Number" value={chartValueInput} onChange={(e) => setChartValueInput(e.target.value)} />
            <button onClick={() => {
              const newEntry = {
                date: formatDate(),
                value: Number(chartValueInput),
              };
              setCharts((prev) => prev.map((chart, idx) => idx === editingChartIndex
                ? {
                  ...chart,
                  entries: [...chart.entries, newEntry],
                }
                : chart));
              setChartValueInput("");
              setEditingChartIndex(null);
            }}> Add </button>
            <button onClick={() => setEditingChartIndex(null)}>Cancel</button>
          </div>
        </div>
      )}
      {/* ------------Edit chart entry ---------------------- */}
      {selectedChartPoint && (
        <div className="modal">
          <div className="modalcontainer">
            <h3>Edit Chart Entry</h3>
            <p>
              Date: {charts[selectedChartPoint.chartIndex].entries[selectedChartPoint.entryIndex].date}
            </p>
            <input type="number" value={editChartEntryValue} onChange={(e) => setEditChartEntryValue(e.target.value)} placeholder="New Value" />
            <button onClick={() => {
              // Rename (change value)
              setCharts((prev) => prev.map((chart, chartIdx) => chartIdx === selectedChartPoint.chartIndex
                ? {
                  ...chart, entries: chart.entries.map((entry, entryIdx) => entryIdx === selectedChartPoint.entryIndex
                    ? { ...entry, value: Number(editChartEntryValue) } : entry
                  ),
                } : chart
              )
              );
              setSelectedChartPoint(null);
              setEditChartEntryValue("");
            }}> Save </button>
            <button onClick={() => {
              setCharts((prev) => prev.map((chart, chartIdx) => chartIdx === selectedChartPoint.chartIndex
                ? {
                  ...chart, entries: chart.entries.filter(
                    (_, entryIdx) => entryIdx !== selectedChartPoint.entryIndex
                  ),
                } : chart
              )
              );
              setSelectedChartPoint(null);
            }} className="red"> Delete </button>
            <button onClick={() => setSelectedChartPoint(null)}>Cancel</button>
          </div>
        </div>
      )}
      {/* ------------End of main container ---------------------- */}
    </div>
  );
}

export default App;
