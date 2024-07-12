<template>
  <p>Below is a changelog for the AMOS application.  Updates to the database are on a different cycle and are currently not tracked here.</p>
  <p>Note: The 2024-06-20 release was not the first release of AMOS, just the earliest mentioned here.</p>
  <details>
    <summary>2024-07-12</summary>
    <ul>
      <li>Expanded the table in the fact sheet list to cover all of the page. Individual fact sheets now open in new tabs, like in the methods list.</li>
      <li>Altered all AG Grid tables to make copy operations only copy the selected cell to the clipboard instead of the entire row.</li>
      <li>Added options for including substance-level ClassyFire info and additional Analytical QC info in batch search results.</li>
      <li>Hyperlinked the last level of a ClassyFire display to the ClassyFire search page, which will pre-fill the fields and run a search with the given classification.</li>
      <li>Fixed an issue with the substance download for the Analytical QC list -- substances are now properly being deduplicated.</li>
      <li>Changed "Classification"  to "ClassyFire" for that search in its URL and the navigation bar.</li>
    </ul>
  </details>
  <details>
    <summary>2024-06-28</summary>
    <ul>
      <li>Tweaked the navigation bar to include the application name, a link to the home page, and date of last update on the left side.</li>
      <li>Fixed an bug where the similar method search could error out if some methodologies for the method hadn't been curated.</li>
    </ul>
  </details>
  <details>
    <summary>2024-06-26</summary>
    <ul>
      <li>Hyperlinked DTXSIDs in ClassyFire search to CompTox.</li>
      <li>Added a substance filter to the fact sheet list.</li>
      <li>Widened the search fields on the ClassyFireClassificationSearch (they now scale with window size).</li>
      <li>Added basic loading messages to the method list and Analytical QC list.</li>
      <li>Moved the analyte visualization from the "About" dropdown to "Other Pages".</li>
      <li>Assorted changes to the Analytical QC list.</li>
    </ul>
  </details>
  <details>
    <summary>2024-06-20</summary>
    <ul>
      <li>Changed the logic for locating substance images; this should significantly speed up image-heavy operations.</li>
      <li>Clarified the column in the ClassyFire search that describes whether there is data for a substance in AMOS or not.</li>
      <li>Added a substance filter to the fact sheet list that allows searching for one substance in the fact sheet list.</li>
      <li>Added a column for timepoints to the Analytical QC list.</li>
      <li>Fixed an issue with the InChIKey disambiguation modal where the wrong images were being displayed next to substances if an exact match was found.</li>
    </ul>
  </details>
</template>