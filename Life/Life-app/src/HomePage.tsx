import "./HomePage.css";
import { useState, useEffect  } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, } from "chart.js";
import { Line } from "react-chartjs-2";
// @ts-ignore

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

type ModalStep = null | "category" | "counter" | "graph" | "textbox";

interface Counter {
   _id: string;
  title: string;
  value: number;
}

interface Notes {
  _id: string;
  title: string;
  entries: string[];
}

interface ChartEntry {
  date: string;
  value: number;
  showDelete?: boolean;
}

interface ChartData {
  _id: string;
  title: string;
  entries: ChartEntry[];
}

function HomePage() {
  
 

  

  const [modalStep, setModalStep] = useState<ModalStep>(null);

  const [newCounterTitle, setNewCounterTitle] = useState("");
  

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [notes, setNotes] = useState<Notes[]>([]);

  const [newChartTitle, setNewChartTitle] = useState("");
  const [charts, setCharts] = useState<ChartData[]>([]);

  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [noteEntryText, setNoteEntryText] = useState("");

  const [editingChartIndex, setEditingChartIndex] = useState<number | null>(null);
  const [chartValueInput, setChartValueInput] = useState("");

 
  
  const [showCharts, setShowCharts] = useState(false);
  const [showNotes, setShowNotes] = useState(false);


  
  const [counters, setCounters] = useState<Counter[]>([]);
  const [showCounters, setShowCounters] = useState(true);

  

   useEffect(() => {
    if (showCounters) {
      const fetchCounters = async () => {
        try {
          const res = await fetch("https://life-app-o6wa.onrender.com/tracker/allCounters", {
            method: "GET",
            credentials: "include",  // IMPORTANT: send cookies/session info
          });

          if (!res.ok) throw new Error("Failed to fetch counters");

          const data = await res.json();
          console.log(counters);
          setCounters(data);
        } catch (err) {
          console.error(err);
          alert("Could not load counters");
        }
      };
      fetchCounters();
    }
  }, [showCounters]);

  // Update counter value on backend
  const updateCounterOnServer = async (counter: Counter) => {
    if (!counter._id) return;

    try {
      const res = await fetch(`https://life-app-o6wa.onrender.com/tracker/updateCounter/${counter._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: counter.value }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update counter");
    } catch (error) {
      console.error(error);
      alert("Failed to update counter");
    }
  };

  // Increment counter locally and sync with backend
  const incrementCounter = async (index: number) => {
    const updatedCounters = [...counters];
    updatedCounters[index].value += 1;
    setCounters(updatedCounters);
    await updateCounterOnServer(updatedCounters[index]);
  };

  // Decrement counter locally and sync with backend
  const decrementCounter = async (index: number) => {
    const updatedCounters = [...counters];
    if (updatedCounters[index].value > 0) {
      updatedCounters[index].value -= 1;
      setCounters(updatedCounters);
      await updateCounterOnServer(updatedCounters[index]);
    }
  };

  // Reset counter to zero and sync with backend
  const resetCounter = async (index: number) => {
    const updatedCounters = [...counters];
    updatedCounters[index].value = 0;
    setCounters(updatedCounters);
    await updateCounterOnServer(updatedCounters[index]);
  };

  // Delete counter from backend and state
  const deleteCounter = async (index: number) => {
    const counterToDelete = counters[index];
    if (!counterToDelete._id) return;

    try {
      const res = await fetch(`https://life-app-o6wa.onrender.com/tracker/deleteCounter/${counterToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete counter");

      setCounters((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
      alert("Failed to delete counter");
    }
  };

  // Add new counter to backend and state
  const handleAddCounter = async () => {
    if (!newCounterTitle.trim()) return;

    try {
      const response = await fetch("https://life-app-o6wa.onrender.com/tracker/addCounter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCounterTitle, value: 0 }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add counter");

      setCounters((prev) => [...prev, { _id: data._id, title: data.title, value: data.value }]);
      setNewCounterTitle("");
      setModalStep(null);
    } catch (err) {
      console.error(err);
      alert("Could not add counter");
    }
  };

  useEffect(() => {
  if (showNotes) {
    const fetchNotes = async () => {
      try {
        const res = await fetch("https://life-app-o6wa.onrender.com/tracker/allNotes", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch notes");

        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error(err);
        alert("Could not load notes");
      }
    };
    fetchNotes();
  }
}, [showNotes]);


const handleNotes = async () => {
  if (!newNoteTitle.trim()) return;
  try {
    const response = await fetch("https://life-app-o6wa.onrender.com/tracker/addNote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newNoteTitle }),  // only send title
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to add note");
    // Update notes with the new note, matching your frontend Notes interface
    setNotes((prev) => [...prev, { _id: data._id, title: data.title, entries: [] }]);
    console.log("asdasd")
    setNewNoteTitle("");
    setModalStep(null);
  } catch (err) {
    console.error(err);
    alert("Could not add note");
  }
};

useEffect(() => {
  if (showCharts) {
    const fetchCharts = async () => {
      try {
        const res = await fetch("https://life-app-o6wa.onrender.com/tracker/allCharts", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch charts");

        const data = await res.json();
        setCharts(data);
      } catch (err) {
        alert("Could not load charts");
      }
    };
    fetchCharts();
  }
}, [showCharts]);

const handleAddChart = async () => {
  if (!newChartTitle.trim()) return alert("Chart title cannot be empty");

  try {
    const res = await fetch("https://life-app-o6wa.onrender.com/tracker/createChart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: newChartTitle }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create chart");
    }

    const createdChart = await res.json();

    setCharts((prev) => [...prev, createdChart]);
    setNewChartTitle("");
    setModalStep(null);
  } catch (error) {
    alert((error as Error).message);
  }
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

         {showCounters && (
          <div className="counter-section">
            {counters.map((counter, index) => (
              <div className="simplecounter" key={`counter-${index}`}>
                <div className="card">
                  <div className="ctitle">
                    <h2>{counter.title}</h2>
                    <div className="cdelete">
                      <button
                        className="redsmall"
                        onClick={() => deleteCounter(index)}
                      >
                        x
                      </button>
                    </div>
                  </div>

                  <p>{counter.value}</p>
                  <button className="red" onClick={() => decrementCounter(index)}>
                    -
                  </button>
                  <button className="reset" onClick={() => resetCounter(index)}>
                    Reset
                  </button>
                  <button className="green" onClick={() => incrementCounter(index)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
              {/* -------------------Charts ----------------- */}
              {showCharts &&(
                  <div className="chart-section">
                      {(charts || []).map((chart, index) => (
                        <div className="card" key={`chart-${index}`}>
                          <h3>{chart.title}</h3>
                          <Line
                            data={{
                              labels: (chart.entries || []).map((e)=> e.date),
                              datasets: [
                                {
                                  data: (chart.entries || []).map((e) => e.value),
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
                            <button className="red" onClick={async () => {
                                      try {
                                        const chartId = charts[index]._id;
                                        const res = await fetch(`https://life-app-o6wa.onrender.com/tracker/deleteChart/${chartId}`, {
                                          method: "DELETE",
                                          credentials: "include",
                                        });
                                        if (!res.ok) throw new Error("Failed to delete chart");
                                        setCharts(prev => prev.filter((_, i) => i !== index));
                                      } catch {
                                        alert("Error deleting chart");
                                      }
                                    }}>
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
                            {(note.entries || []).map((entry, entryIndex) => (
                              <li key={`entry-${entryIndex}`}>
                                <span>{entry}</span>
                                <button
                                  className="red"
                                  onClick={async () => {
                                    try {
                                      const res = await fetch(
                                        `https://life-app-o6wa.onrender.com/tracker/removeEntry/${note._id}/${entryIndex}`,
                                        {
                                          method: "PUT",
                                          credentials: "include",
                                        }
                                      );

                                      if (!res.ok) {
                                        const errorData = await res.json();
                                        throw new Error(errorData.error || "Failed to remove entry");
                                      }

                                      const updatedNote = await res.json();
                                      setNotes((prev) =>
                                        prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
                                      );
                                    } catch (error) {
                                      alert((error as Error).message);
                                    }
                                  }}
                                >
                                  X
                                </button>
                              </li>
                            ))}
                          </ul>

                        </div>
                        <div className="notebuttons">
                          <button
                                        className="red"
                                        onClick={async () => {
                                          if (!window.confirm("Delete this note?")) return;

                                          try {
                                            const res = await fetch(
                                              `https://life-app-o6wa.onrender.com/tracker/deleteNote/${note._id}`,
                                              {
                                                method: "DELETE",
                                                credentials: "include",
                                              }
                                            );

                                            if (!res.ok) {
                                              const errorData = await res.json();
                                              throw new Error(errorData.error || "Failed to delete note");
                                            }

                                            setNotes((prev) => prev.filter((n) => n._id !== note._id));
                                          } catch (error) {
                                            alert((error as Error).message);
                                          }
                                        }}
                                      >
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
            <button onClick={async () => {
                    if (!noteEntryText.trim()) return alert("Entry cannot be empty");

                    try {
                      const noteId = notes[editingNoteIndex!]._id; // assuming you have _id in your note

                      const res = await fetch(`https://life-app-o6wa.onrender.com/tracker/addEntry/${noteId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ entry: noteEntryText }),
                        credentials: "include",
                      });

                      if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || "Failed to add entry");
                      }

                      const updatedNote = await res.json();

                      // Update local state with the updated note from backend
                      setNotes((prev) =>
                        prev.map((note, idx) => idx === editingNoteIndex ? updatedNote : note)
                      );

                      setNoteEntryText("");
                      setEditingNoteIndex(null);
                    } catch (error) {
                      console.error(error);
                      alert((error as Error).message);
                    }
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
            <button onClick={async () => {
                if (!chartValueInput.trim()) return alert("Value cannot be empty");
                const newEntry = {
                  date: formatDate(),
                  value: Number(chartValueInput),
                };
                try {
                  const chartId = charts[editingChartIndex!]._id;
                  const res = await fetch(`https://life-app-o6wa.onrender.com/tracker/addChartEntry/${chartId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ entry: newEntry }),
                    credentials: "include",
                  });
                  if (!res.ok) {
                     console.log("this is here")
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to add entry");
                   
                  }
                  
                  const updatedChart = await res.json();
                  setCharts(prev => prev.map((chart, idx) => idx === editingChartIndex ? updatedChart : chart));
                  setChartValueInput("");
                  setEditingChartIndex(null);
                } catch (error) {
                  alert((error as Error).message);
                }
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
            <button onClick={async () => {
                  try {
                    const chartId = charts[selectedChartPoint.chartIndex]._id;
                    const entryIndex = selectedChartPoint.entryIndex;
                    const res = await fetch(`https://life-app-o6wa.onrender.com/tracker/updateEntry/${chartId}/${entryIndex}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ value: Number(editChartEntryValue) }),
                      credentials: "include",
                    });
                    if (!res.ok) throw new Error("Failed to update entry");
                    const updatedChart = await res.json();
                    setCharts(prev => prev.map((chart, idx) => idx === selectedChartPoint.chartIndex ? updatedChart : chart));
                    setSelectedChartPoint(null);
                    setEditChartEntryValue("");
                  } catch (error) {
                    alert("Error updating entry");
                  }
                }}> Save </button>

            <button onClick={async () => {
                try {
                  const chartId = charts[selectedChartPoint.chartIndex]._id;
                  const entryIndex = selectedChartPoint.entryIndex;
                  const res = await fetch(`https://life-app-o6wa.onrender.com/tracker/deleteEntry/${chartId}/${entryIndex}`, {
                    method: "DELETE",
                    credentials: "include",
                  });
                  if (!res.ok) throw new Error("Failed to delete entry");
                  const updatedChart = await res.json();
                  setCharts(prev => prev.map((chart, idx) => idx === selectedChartPoint.chartIndex ? updatedChart : chart));
                  setSelectedChartPoint(null);
                } catch {
                  alert("Error deleting entry");
                }
              }}> Delete </button>

            <button onClick={() => setSelectedChartPoint(null)}>Cancel</button>
          </div>
        </div>
      )}
      {/* ------------End of main container ---------------------- */}
    </div>
  );
}

export default HomePage;
