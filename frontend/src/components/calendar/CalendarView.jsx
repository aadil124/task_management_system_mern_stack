import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isToday,
  isPast,
  isWithinInterval,
  endOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import toast from "react-hot-toast";

import fetchWithAuth from "../../utils/fetchWithAuth";
import TaskEventModal from "./TaskEventModal";
import CalendarToolbar from "./CalendarToolbar";
import CalendarFilters from "./CalendarFilters";
import CalendarSummaryCards from "./CalendarSummaryCards";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  // CONTROLLED CALENDAR STATE
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetchWithAuth("/api/task-list");
      const data = await res.json();

      if (data.success) {
        const mappedEvents = (data.result || [])
          .filter((task) => task.dueDate)
          .map((task) => ({
            id: task._id,
            title: task.title,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            allDay: true,
            resource: task,
          }));

        setEvents(mappedEvents);
      } else {
        toast.error(data.message || "Failed to fetch tasks");
      }
    } catch {
      toast.error("Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedTask(event.resource);
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = format(slotInfo.start, "yyyy-MM-dd");
    navigate(`/add-task?date=${selectedDate}`);
  };

  // FIXED NAVIGATION HANDLERS
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const eventStyleGetter = (event) => {
    const task = event.resource;

    if (task.status === "completed") {
      return {
        style: {
          backgroundColor: "#198754",
          borderRadius: "10px",
          border: "none",
          color: "#fff",
        },
      };
    }

    if (isToday(event.start)) {
      return {
        style: {
          backgroundColor: "#0d6efd",
          borderRadius: "10px",
          border: "none",
          color: "#fff",
        },
      };
    }

    if (isPast(event.start)) {
      return {
        style: {
          backgroundColor: "#dc3545",
          borderRadius: "10px",
          border: "none",
          color: "#fff",
        },
      };
    }

    return {
      style: {
        backgroundColor: "#fd7e14",
        borderRadius: "10px",
        border: "none",
        color: "#fff",
      },
    };
  };

  const filteredEvents = events.filter((event) => {
    const task = event.resource;

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = !priority || task.priority === priority;

    const matchesStatus = !status || task.status === status;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const allTasks = filteredEvents.map((event) => event.resource);

  const stats = {
    overdue: allTasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.dueDate &&
        isPast(new Date(task.dueDate)) &&
        !isToday(new Date(task.dueDate)),
    ).length,

    today: allTasks.filter(
      (task) => task.dueDate && isToday(new Date(task.dueDate)),
    ).length,

    week: allTasks.filter(
      (task) =>
        task.dueDate &&
        isWithinInterval(new Date(task.dueDate), {
          start: new Date(),
          end: endOfWeek(new Date()),
        }),
    ).length,

    completed: allTasks.filter((task) => task.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <CalendarFilters
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
      />

      <CalendarSummaryCards stats={stats} />

      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div className="card-body">
          <div style={{ height: "80vh" }}>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              popup
              selectable
              views={["month", "week", "day"]}
              view={currentView}
              date={currentDate}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CalendarToolbar,
              }}
            />
          </div>
        </div>
      </div>

      <TaskEventModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};

export default CalendarView;
