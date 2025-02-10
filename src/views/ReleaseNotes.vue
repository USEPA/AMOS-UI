<template>
  <p>Below is a changelog for the AMOS application.  Updates to the database are on a different cycle and are currently not tracked here.</p>
  <p>Note: The 2024-06-20 release was not the first release of AMOS, just the earliest mentioned here.</p>
  <details>
    <summary>2025-02-10</summary>
    <ul>
      <!-- NTA --> <li>Two visualizations have been added to the results page for the NTA MS1 results -- a CV scatterplot (extracted from the zipped results file) and a tree view of the filtering of occurrences and features in the data.</li>
      <!-- NTA --> <li>Modified the NA field for the NTA MS1 job submission -- it is no longer a required field.</li>
      <!-- NTA --> <li>Added a bunch of tooltips for the inputs on the MS1 job submission page.</li>
      <li>Added an option to the partial identifier search to filter/show multicomponent substances.</li>
    </ul>
  </details>
  <details>
    <summary>2025-01-30</summary>
    <ul>
      <!--NTA--><li>Updated the default value of the NA field for the MS1 NTA job submission.</li>
      <li>Added functional use classes to the substance displays in the general and similar structure searches.</li>
    </ul>
  </details>
  <details>
    <summary>2025-01-27</summary>
    <ul>
      <!--NTA--> <li>Added a field for NA values to MS1NTAJobSubmission along with some basic validation.</li>
      <!--NTA--> <li>Updated some of the adduct options and default values on MS1NTAJobSubmission.</li>
      <li>Re-enlarged some the mass spectrum input fields for the search and comparison pages.</li>
      <li>The select/deselect all buttons on the batch search now act on the mass spectrum metadata options and source count option.</li>
      <li>Fixed a minor issue with the About page.</li>
    </ul>
  </details>
  <details>
    <summary>2025-01-23</summary>
    <ul>
      <!--NTA--> <li>Functionality has been added for submitting non-targeted analysis (NTA) jobs under the header of "INTERPRET NTA".  This is still under construction, but the current job page is functional.</li>
      <li>Mass spectrum plots on the mass spectrum comparison page will grey out peaks that are below a specified threshold; these will also be ignored in entropy calculations.</li>
      <li>Control of the similarity window used in the similar entropy calculations has been added to the mass spectrum comparison and search pages.  Mirrored spectrum plots on these pages will highlight similar peaks on these pages as well.</li>
      <li>More detailed breakdowns of the spectra in AMOS's database have been added to the about page.</li>
      <li>Counts of external sources have been added to the partial identifier search (now renamed "Formula, Mass, & Partial Identifier Search" in the navigation bar).</li>
    </ul>
  </details>
  <details>
    <summary>2025-01-06</summary>
    <ul>
      <li>Counts of sources from external types of records (patents, literature, PubMed, etc.) have been incorporated into the partial identifier search, and are an option on the batch search.</li>
      <li>Improved text on the partial identifier search to give clearer status information.</li>
      <li>Added a control to the mass spectrum comparison page for filtering peaks below a threshold intensity.</li>
      <li>Added a filter to the mass spectrum search to hide database spectra that are below a certain entropy similarity.</li>
      <li>Added labels to better indicate what the top and bottom parts are of the mirrored spectrum plot used in the mass spectrum search and comparison pages.</li>
      <li>Added some options for additional mass spectrum information to the batch search.</li>
      <li>Fixed an issue where InChIKeys might not display when comparing substances in the similar structure search.</li>
      <li>Added hovertext to the substance names on the substance grids in the PDF displays.</li>
    </ul>
  </details>
  <details>
    <summary>2024-12-02</summary>
    <ul>
      <li>Fixed an issue with calculating mass ranges using PPM in the mass spectrum and partial identifier searches.</li>
      <li>Improved the handling of whitespace in MassSpectrumComparison's inputs -- it should now handle arbitrary non-line-breaking whitespace between the m/z and intensity values.</li>
      <li>The coloring of the bottom spectrum on the mirrored mass spectrum plots has been changed to orange, to be more distinct from the top half of the plots.</li>
      <li>Added a display for NMR spectrum metadata.</li>
      <li>The partial identifier search now defaults to sorting by decreasing number of spectra if a mass range search is run, instead of the decreasing number of methods used by other searches.</li>
      <li>Added a message to the partial identifier search about imposed mass range search limitations (0.5 Da or 25 ppm).</li>
      <li>Added a column for the number of substances in a given record to the batch search.</li>
    </ul>
  </details>
  <details>
    <summary>2024-11-22</summary>
    <ul>
      <li>Added a mass range search to the partial identifier search.</li>
      <li>Fixed the "Copy to Clipboard" functionality in modal displays like the mass spectrum metadata.</li>
      <li>Added buttons to the partial identifier search for copying searches to a URL, downloading information from the table, and sending a list of substances to the batch search.</li>
      <li>Fixed double-clicking a row in the partial identifier search not searching the selected substance in a new tab.</li>
      <li>Fixed and reenabled the help/tooltip icons on a few pages.</li>
      <li>The first blocks of InChIKeys in substance information displays are now hyperlinked to the partial identifier search; clicking a link will open a search on that first block in a new tab.</li>
      <li>Made a more explicit listing of AMOS's functionality on the home page.</li>
    </ul>
  </details>
  <details>
    <summary>2024-10-30</summary>
    <ul>
      <li>Added a viewer component and a page for viewing IR spectra; there are currently only a few hundred in the database (search for DTXSID101017069 for an example).</li>
      <li>Added a page to perform partial identifier searches -- searches return a list of substances based on a name substring, the first block of an InChIKey, or an exact molecular formula.</li>
    </ul>
  </details>
  <details>
    <summary>2024-10-08</summary>
    <ul>
      <li>Made some generalizations to whitespace matching in the separators between m/z and intensity values for the mass spectrum search -- previously it would only be considered valid if the values were separated by exactly one regular space.</li>
      <li>Added a more thorough error message for incorrectly-formatted user spectra in the mass spectrum search.</li>
      <li>Replaced the 'Limitation' column in the methods list with separate columns for the limits of quantitation and detection.</li>
      <li>Fixed an issue with the InChIKey disambiguation where it might not display results if the first block of an InChIKey was matched but not the full InChIKey.</li>
      <li>Fixed a bug with the generation of URLs generated to prepopulate table filters (used in the method and fact sheet searches, among others).</li>
      <li>Disabled use of a help icon due to the tooltip display being broken for now.</li>
    </ul>
  </details>
  <details>
    <summary>2024-09-25</summary>
    <ul>
      <li>Fixed an issue with the search mechanism in the analyte visualization which prevented it from working correctly.</li>
      <li>Fixed an issue with viewing non-Analytical QC spectrum PDFs in the general search results.</li>
      <li>Added tooltips to a couple fields in the fact sheet list.</li>
      <li>Added sorting to the columns of the data sources table.</li>
      <li>Bolded the label text for internal links for PDFs.</li>
      <li>Updated some abbreviations and direct links to sources (not for individual records).</li>
    </ul>
  </details>
  <details>
    <summary>2024-09-24</summary>
    <ul>
      <li>The data sources page now shows information about data sources in a table, and some information has been fleshed out.</li>
      <li>Modified the batch search's output to include AMOS internal links to records.  Field names in the output file have also been renamed to something a little more natural.</li>
      <li>Added a record ID search option to the home page and navigation bar.</li>
      <li>Modified the general search results to sort by substance counts when looking at fact sheets.  This shouldn't override other sorts that are in place when switching to looking at fact sheets.</li>
      <li>Added substance counts to the fact sheet list.</li>
      <li>Added internal links for PDFs to the displays of their metadata.</li>
    </ul>
  </details>
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