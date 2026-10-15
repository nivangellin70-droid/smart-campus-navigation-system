import React, { useState, useEffect, useRef } from 'react';
import { CampusLocation, RouteComputationResult } from '../types/campus';
import { computeCampusRoute } from '../data/campusData';
import { CampusBlueprintMap } from '../components/CampusBlueprintMap';
import {
  Navigation,
  ArrowUpDown,
  Accessibility,
  Clock,
  Footprints,
  Flame,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  MapPin,
  CheckCircle2,
  ArrowRight,
  CornerDownRight,
  Building,
} from 'lucide-react';

interface NavigationViewProps {
  locations: CampusLocation[];
  initialSourceId?: string;
  initialDestinationId?: string;
  onSelectLocation: (loc: CampusLocation) => void;
  onActiveRouteChanged?: (route: RouteComputationResult | null) => void;
}

export const NavigationView: React.FC<NavigationViewProps> = ({
  locations,
  initialSourceId = 'gate-01',
  initialDestinationId = 'lib-01',
  onSelectLocation,
  onActiveRouteChanged,
}) => {
  const [sourceId, setSourceId] = useState(initialSourceId);
  const [destinationId, setDestinationId] = useState(initialDestinationId);
  const [requireAccessible, setRequireAccessible] = useState(false);

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0); // 0 to 1
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [voiceVoiceEnabled, setVoiceEnabled] = useState(false);

  const simulationTimerRef = useRef<number | null>(null);

  // Compute Route
  const route: RouteComputationResult | null = React.useMemo(() => {
    return computeCampusRoute(sourceId, destinationId, requireAccessible, locations);
  }, [sourceId, destinationId, requireAccessible, locations]);

  // Notify parent of active route
  useEffect(() => {
    if (onActiveRouteChanged) {
      onActiveRouteChanged(route);
    }
  }, [route, onActiveRouteChanged]);

  // Voice narration helper
  const announceInstruction = (text: string) => {
    if (!voiceVoiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis unsupported or suppressed
    }
  };

  // Swap source and destination
  const handleSwap = () => {
    const temp = sourceId;
    setSourceId(destinationId);
    setDestinationId(temp);
    handleResetSimulation();
  };

  // Simulation controls
  const handleStartSimulation = () => {
    setIsSimulating(true);
    if (route && route.steps.length > 0) {
      announceInstruction(route.steps[0].instruction);
    }
  };

  const handlePauseSimulation = () => {
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationProgress(0);
    setActiveStepIndex(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (!isSimulating || !route || route.pathNodes.length <= 1) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      return;
    }

    const intervalMs = 150;
    const totalDurationMs = Math.min(25000, Math.max(8000, route.totalDistanceMeters * 30));
    const stepRatioIncrement = intervalMs / totalDurationMs;

    simulationTimerRef.current = window.setInterval(() => {
      setSimulationProgress((prev) => {
        const next = prev + stepRatioIncrement;
        if (next >= 1) {
          clearInterval(simulationTimerRef.current!);
          setIsSimulating(false);
          announceInstruction(`You have arrived at your destination: ${route.toLocation.name}.`);
          return 1;
        }

        // Map progress to turn-by-turn step
        const stepIdx = Math.min(
          route.steps.length - 1,
          Math.floor(next * route.steps.length)
        );
        setActiveStepIndex(stepIdx);

        return next;
      });
    }, intervalMs);

    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [isSimulating, route]);

  // Voice announce when active step changes
  useEffect(() => {
    if (isSimulating && route && route.steps[activeStepIndex]) {
      announceInstruction(route.steps[activeStepIndex].instruction);
    }
  }, [activeStepIndex]);

  return (
    <div className="space-y-8 pb-16">
      {/* Wayfinding Top Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Navigation className="w-6 h-6 text-blue-600" />
            Turn-by-Turn Wayfinding & Routing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Graph-based A* & Dijkstra routing algorithm calculates optimal pedestrian paths, estimated walking times, and accessibility accommodations.
          </p>
        </div>

        {/* Source & Destination Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Source Dropdown (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Source (Departure Point)
            </label>
            <select
              value={sourceId}
              onChange={(e) => {
                setSourceId(e.target.value);
                handleResetSimulation();
              }}
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button (2 cols) */}
          <div className="md:col-span-2 flex justify-center pt-3 md:pt-0">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 transition-colors shadow-xs cursor-pointer"
              title="Swap Start & Destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Dropdown (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              Destination (Target Facility)
            </label>
            <select
              value={destinationId}
              onChange={(e) => {
                setDestinationId(e.target.value);
                handleResetSimulation();
              }}
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Route Preference & Voice Assist Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={requireAccessible}
                onChange={(e) => {
                  setRequireAccessible(e.target.checked);
                  handleResetSimulation();
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Accessibility className="w-4 h-4 text-emerald-600" />
              <span>Wheelchair / Step-Free Path Only</span>
            </label>

            <button
              onClick={() => setVoiceEnabled(!voiceVoiceEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                voiceVoiceEnabled
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {voiceVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>Voice Guidance {voiceVoiceEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Quick Depart:</span>
            <button
              onClick={() => {
                setSourceId('gate-01');
                handleResetSimulation();
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold cursor-pointer"
            >
              Main Gate
            </button>
            <button
              onClick={() => {
                setSourceId('gate-02');
                handleResetSimulation();
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold cursor-pointer"
            >
              Metro Plaza
            </button>
          </div>
        </div>
      </div>

      {/* Route Results Strip */}
      {route && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
            <Footprints className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <span className="text-xs text-slate-500 block">Total Walking Distance</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {route.totalDistanceMeters} <span className="text-sm font-semibold text-slate-500">meters</span>
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
            <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-xs text-slate-500 block">Estimated Time</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              ~{route.estimatedMinutes} <span className="text-sm font-semibold text-slate-500">min walk</span>
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
            <Compass className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
            <span className="text-xs text-slate-500 block">Step Count</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {route.stepCount} <span className="text-sm font-semibold text-slate-500">steps</span>
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <span className="text-xs text-slate-500 block">Calories Burned</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {route.caloriesBurned} <span className="text-sm font-semibold text-slate-500">kcal</span>
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Map Visualizer (7 cols) & Turn-by-Turn Guide (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map with Animated Route (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              Walkway Path Visualization
            </h2>
            <span className="text-xs text-slate-500">
              Blue glowing line represents walkable route
            </span>
          </div>

          <CampusBlueprintMap
            locations={locations}
            selectedLocation={route?.toLocation || null}
            onSelectLocation={onSelectLocation}
            activeRoute={route}
            activeStepIndex={activeStepIndex}
            simulatedProgressRatio={simulationProgress}
          />

          {/* Simulation Playback Bar */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Live Walk Simulator
                </span>
                <span className="text-xs text-slate-400">
                  {Math.round(simulationProgress * 100)}% Completed
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isSimulating ? (
                  <button
                    onClick={handleStartSimulation}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{simulationProgress > 0 ? 'Resume Walk' : 'Start Simulated Walk'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseSimulation}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleResetSimulation}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
                  title="Reset Walk"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-200"
                style={{ width: `${simulationProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Directions Deck (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <CornerDownRight className="w-4 h-4 text-blue-600" />
              Turn-by-Turn Navigation
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {route?.steps.length || 0} Steps
            </span>
          </div>

          {route && route.steps.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {route.steps.map((step, idx) => {
                const isCurrentStep = isSimulating && activeStepIndex === idx;
                const isPassed = isSimulating && activeStepIndex > idx;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 ${
                      isCurrentStep
                        ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-400/20 shadow-sm'
                        : isPassed
                        ? 'bg-slate-50/60 border-slate-200 opacity-70'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCurrentStep
                              ? 'bg-blue-600 text-white'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isPassed ? '✓' : step.stepNumber}
                        </span>
                        <span className="font-semibold text-slate-900 leading-snug">
                          {step.instruction}
                        </span>
                      </div>
                    </div>

                    {step.distanceMeters > 0 && (
                      <div className="flex items-center gap-3 pl-8 text-slate-500 text-[11px]">
                        <span>Distance: {step.distanceMeters}m</span>
                        <span>·</span>
                        <span>Walk ~{step.estimatedSeconds}s</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Select source and destination to view step instructions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
