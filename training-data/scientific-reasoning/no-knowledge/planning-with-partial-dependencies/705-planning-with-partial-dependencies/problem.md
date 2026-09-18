# 705 — Planning with partial dependencies

Given knowledge. A mirror does not produce light; it changes the direction of light that reaches its surface. In the grid-ray model, the outgoing angle is symmetric with the incoming angle relative to the normal to the mirror. Light travels in straight lines in the uniform medium of the model. A matte surface scatters light in many directions.

Problem data. The dependencies are: “the source emits the ray” without prerequisites; “the ray reaches mirror” without prerequisites; “the ray is reflected” after “the source emits the ray” and “the ray reaches mirror”; “the ray travels through space” after “the ray is reflected”; “the ray reaches or not at screen” after “the ray reaches mirror”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
