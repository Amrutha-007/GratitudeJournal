import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://gratitudejournal-267n.onrender.com/api/gratitude/";

const moods = ["😊", "🥰", "🌸", "✨", "😌", "💗"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function App() {
  const [entries, setEntries] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("😊");

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Calendar
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // =========================
  // GET ENTRIES
  // =========================

  const fetchEntries = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
      })
      .catch((error) => {
        console.error("Error loading entries:", error);
      });
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    const entryData = {
      title: title,
      content: content,
      mood: mood,
    };

    try {
      let response;

      if (editingId) {
        response = await fetch(`${API_URL}${editingId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entryData),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entryData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);

        alert("Something went wrong. Check the backend.");
        return;
      }

      setTitle("");
      setContent("");
      setMood("😊");
      setEditingId(null);

      fetchEntries();
    } catch (error) {
      console.error("Error:", error);
      alert("Cannot connect to the Django backend.");
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || "😊");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this gratitude?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Delete failed.");
        return;
      }

      fetchEntries();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMood("😊");
  };

  // =========================
  // CALENDAR
  // =========================

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  // Make Monday the first day
  const mondayFirstDay =
    firstDay === 0 ? 6 : firstDay - 1;

  const previousMonth = () => {
    setCalendarDate(
      new Date(year, month - 1, 1)
    );
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCalendarDate(
      new Date(year, month + 1, 1)
    );
    setSelectedDate(null);
  };

  const hasEntryOnDay = (day) => {
    return entries.some((entry) => {
      if (!entry.date) return false;

      const entryDate = new Date(entry.date);

      return (
        entryDate.getFullYear() === year &&
        entryDate.getMonth() === month &&
        entryDate.getDate() === day
      );
    });
  };

  const today = new Date();

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // =========================
  // MONTHLY PROGRESS
  // =========================

  const currentMonthEntries = entries.filter((entry) => {
    if (!entry.date) return false;

    const entryDate = new Date(entry.date);

    return (
      entryDate.getFullYear() === year &&
      entryDate.getMonth() === month
    );
  });

  const monthlyProgress = Math.min(
    Math.round(
      (currentMonthEntries.length / daysInMonth) * 100
    ),
    100
  );

  // =========================
  // SEARCH
  // =========================

  const filteredEntries = entries.filter((entry) => {
    const text =
      `${entry.title} ${entry.content}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  // =========================
  // SELECTED DATE ENTRIES
  // =========================

  const selectedDateEntries = selectedDate
    ? entries.filter((entry) => {
        if (!entry.date) return false;

        const entryDate = new Date(entry.date);

        return (
          entryDate.getFullYear() === year &&
          entryDate.getMonth() === month &&
          entryDate.getDate() === selectedDate
        );
      })
    : [];

  return (
    <div className="app">

      {/* ================= HERO ================= */}

      <header className="hero">

        <p className="eyebrow">
          A LITTLE SPACE FOR APPRECIATION
        </p>

        <h1>
          My Gratitude Journal
        </h1>

        <p className="subtitle">
          Pause. Reflect. Appreciate the little things.
        </p>

        <div className="stats">

          <div className="stat-card">
            <strong>
              {entries.length}
            </strong>

            <span>
              Gratitudes
            </span>
          </div>

          <div className="stat-card">
            <strong>
              ♡
            </strong>

            <span>
              Moments to cherish
            </span>
          </div>

        </div>

      </header>


      <main className="main-content">

        {/* ================= REFLECTION + CALENDAR ================= */}

        <div className="reflection-calendar-grid">

          {/* ================= FORM ================= */}

          <section className="form-card">

            <div className="form-heading">

              <div>

                <span className="section-label">
                  TODAY'S REFLECTION
                </span>

                <h2>
                  {editingId
                    ? "Edit your gratitude"
                    : "What are you grateful for?"}
                </h2>

              </div>

              <span className="sparkle">
                ✦
              </span>

            </div>


            <form onSubmit={handleSubmit}>

              <label>
                I'm grateful for...
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="My family, a good friend, a beautiful day..."
              />


              <label>
                Tell me more
              </label>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write about why this moment made you happy..."
              />


              <label>
                How are you feeling?
              </label>

              <div className="mood-row">

                {moods.map((item) => (

                  <button
                    key={item}
                    type="button"
                    className={
                      mood === item
                        ? "mood-button active-mood"
                        : "mood-button"
                    }
                    onClick={() =>
                      setMood(item)
                    }
                  >
                    {item}
                  </button>

                ))}

              </div>


              <div className="selected-mood">
                Selected mood:{" "}
                <strong>{mood}</strong>
              </div>


              <button
                type="submit"
                className="add-button"
              >
                {editingId
                  ? "Save Changes ♡"
                  : "Add Gratitude ♡"}
              </button>


              {editingId && (

                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelEdit}
                >
                  Cancel Editing
                </button>

              )}

            </form>

          </section>


          {/* ================= CALENDAR ================= */}

          <section className="calendar-card">

            <div className="calendar-top">

              <button
                type="button"
                className="calendar-arrow"
                onClick={previousMonth}
              >
                ‹
              </button>


              <div className="calendar-title">

                <span className="calendar-small">
                  YOUR GRATITUDE DAYS
                </span>

                <h2>
                  {monthNames[month]} {year}
                </h2>

              </div>


              <button
                type="button"
                className="calendar-arrow"
                onClick={nextMonth}
              >
                ›
              </button>

            </div>


            <div className="calendar-weekdays">

              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>

            </div>


            <div className="calendar-grid">

              {Array.from({
                length: mondayFirstDay,
              }).map((_, index) => (

                <div
                  key={`empty-${index}`}
                  className="calendar-empty"
                />

              ))}


              {Array.from(
                { length: daysInMonth },
                (_, index) => {

                  const day = index + 1;

                  return (

                    <button
                      type="button"
                      key={day}
                      className={`
                        calendar-day
                        ${isToday(day)
                          ? "calendar-today"
                          : ""}
                        ${selectedDate === day
                          ? "calendar-selected"
                          : ""}
                        ${hasEntryOnDay(day)
                          ? "has-gratitude"
                          : ""}
                      `}
                      onClick={() =>
                        setSelectedDate(day)
                      }
                    >

                      <span>
                        {day}
                      </span>

                      {hasEntryOnDay(day) && (
                        <small>
                          ♡
                        </small>
                      )}

                    </button>

                  );

                }
              )}

            </div>


            {/* ================= CALENDAR FOOTER ================= */}

            <div className="calendar-footer">

              <span>
                ♡
              </span>

              <p>
                A heart marks a day you
                captured a gratitude.
              </p>

            </div>


            {/* ================= MONTHLY PROGRESS ================= */}

            <div className="monthly-progress">

              <div className="progress-heading">

                <div>

                  <span>
                    MONTHLY PROGRESS
                  </span>

                  <strong>
                    {currentMonthEntries.length} /{" "}
                    {daysInMonth} days
                  </strong>

                </div>

                <span className="progress-flower">
                  🌷
                </span>

              </div>


              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${monthlyProgress}%`,
                  }}
                />

              </div>


              <p>
                Every little moment counts.
              </p>

            </div>


            {/* ================= SELECTED DAY ================= */}

            {selectedDate && (

              <div className="selected-day">

                <h3>
                  {monthNames[month]}{" "}
                  {selectedDate}
                </h3>

                {selectedDateEntries.length > 0 ? (

                  selectedDateEntries.map(
                    (entry) => (

                      <div
                        className="calendar-entry"
                        key={entry.id}
                      >

                        <span>
                          {entry.mood || "😊"}
                        </span>

                        <div>

                          <strong>
                            {entry.title}
                          </strong>

                          <p>
                            {entry.content}
                          </p>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <p className="no-day-entry">
                    No gratitude recorded
                    for this day yet.
                  </p>

                )}

              </div>

            )}

          </section>

        </div>


        {/* ================= JOURNEY ================= */}

        <section className="journey">

          <div className="journey-header">

            <div>

              <span className="section-label">
                YOUR JOURNEY
              </span>

              <h2>
                Gratitude moments
              </h2>

            </div>


            <input
              className="search"
              type="text"
              placeholder="🔎 Search your memories..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="entries">

            {filteredEntries.length === 0 ? (

              <div className="empty-card">

                <div>
                  🌱
                </div>

                <h3>
                  No gratitude moments yet
                </h3>

                <p>
                  Start by writing something
                  you're grateful for.
                </p>

              </div>

            ) : (

              filteredEntries.map((entry) => (

                <article
                  className="entry-card"
                  key={entry.id}
                >

                  <div className="entry-top">

                    <span className="entry-mood">
                      {entry.mood || "😊"}
                    </span>

                    <span className="entry-date">

                      {entry.date
                        ? new Date(
                            entry.date
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : ""}

                    </span>

                  </div>


                  <h3>
                    {entry.title}
                  </h3>


                  <p>
                    {entry.content}
                  </p>


                  <div className="entry-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(entry)
                      }
                    >
                      ✎ Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(entry.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </article>

              ))

            )}

          </div>

        </section>


        {/* ================= QUOTE ================= */}

        <section className="quote-card">

          <div className="quote-mark">
            “
          </div>

          <p>
            The real gift of gratitude is that
            the more grateful you are, the more
            present you become.
          </p>

          <span>
            — Robert Holden
          </span>

        </section>

      </main>


      <footer>
        Made with ♡ • Take a moment to appreciate today.
      </footer>

    </div>
  );
}

export default App;