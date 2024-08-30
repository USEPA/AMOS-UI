<template>
  <p>Below is a changelog for the AMOS application.  Updates to the database are on a different cycle and are currently not tracked here.</p>
  <p>Note: The 2024-06-20 release was not the first release of AMOS, just the earliest mentioned here.</p>
  <details>
    <summary>2024-08-30</summary>
    <ul>
      <li>Added some descriptive text and links to other search pages to the front page.</li>
      <li>Fixed an issue with the InChIKey and synonym disambiguations in the similar structure search.</li>
      <li>Added some source links and data source descriptions.</li>
    </ul>
  </details>
  <details>
    <summary>2024-08-14</summary>
    <ul>
      <li>Incorporated a major change to the functional class visualization (previously called the analyte visualization).</li>
      <li>Incorporated fact sheets into the similar method search and renamed it to "similar structure search".</li>
      <li>Added some sorting to the synonym and InChIKey disambiguation modals -- previously the order of results was not guaranteed, now they sort by decreasing number of records (ties are broken by EPA-preferred names.</li>
      <li>Filters related to SpectraBase have been updated so that they now filter all externally linked spectra, now that we have additional sources of externally linked spectra.</li>
      <li>Added fields for LC/MS amenability flags to the Analytical QC list.</li>
      <li>Added a checkbox to the top of the table in the ClassyFire search to select all substances in the table.</li>
      <li>Added a page for viewing NMR spectra, for if/when we add NMR spectra that need it.</li>
      <li>Added a 404 page.</li>
      <li>Changed some bits of text across multiple pages.</li>
    </ul>
  </details>
  <details>
    <summary>2024-07-24</summary>
    <ul>
      <li>Split the data filter on the ClassyFire search into three -- fact sheets, methods, and spectra -- and added a custom filter for selecting whether you want to view data with or without records of that type.</li>
      <li>Fixed an issue with the ClassyFire search where prepopulating the fields using URL query parameters would leave counts for superclasses/classes/subclasses at zero.</li>
      <li>Added ability to send selected substances from the ClassyFire search to the batch search.</li>
      <li>Added a button for copying URL to prepopulate the ClassyFire search to clipboard.</li>
      <li>Added some warning messages to the ClassyFire search for when URL query parameters are bad.</li>
      <li>Added a batch search option for getting only Analytical QC records.</li>
      <li>Added buttons to the batch search to select/deselect most options.</li>
      <li>Added functional use classes to the fact sheet list.</li>
    </ul>
  </details>
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