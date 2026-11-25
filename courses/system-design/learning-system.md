# How to Learn System Design

System design is learned by making and testing models, not by memorizing architecture pictures.

## The study loop

1. **Preview:** write down what you think the component does before reading.
2. **Understand:** read a lesson and one primary source. Mark assumptions and unknowns.
3. **Recall:** close the source and explain the concept aloud or on paper.
4. **Visualize:** draw a request flow, data flow or failure flow. Label protocols and ownership.
5. **Implement:** build a small slice or simulation. Keep it deliberately small.
6. **Measure:** generate load, inspect latency/throughput/resource use and record the environment.
7. **Break:** kill a dependency, add latency, duplicate a message or make a node unavailable.
8. **Teach:** turn the result into a short explanation and update the lesson.

## Keep a learning log

For each study session, capture concept and date, your prior belief, the new mental model, diagram or code link, one surprise, one unresolved question and the next experiment. Use the [learning-log template](templates/learning-log.md).

## How to use AI without outsourcing your understanding

- Ask for a simpler explanation, then verify it against primary sources.
- Ask for counterexamples and failure modes.
- Ask it to critique your diagram, not to design everything for you.
- Try to answer questions before seeing a solution.
- Never cite an AI response as the source of a technical claim.
- Keep the assumptions and final design decisions yours.

## Diagram tools

- [Mermaid Live Editor](https://mermaid.live/) — quick architecture and sequence diagrams.
- [Excalidraw](https://excalidraw.com/) — free-form whiteboard sketches.
- [diagrams.net](https://app.diagrams.net/) — detailed architecture diagrams.
- [Structurizr DSL](https://structurizr.com/dsl) — diagrams as code using C4 concepts.
