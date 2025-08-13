<script>
    /** The text to display inside the tooltip */
    export let text = 'This is a tooltip.';
  </script>
  
  <div class="tooltip-container">
    <!-- Replaced Font Awesome icon with a styled div to ensure it always renders -->
    <div class="icon-replacement" aria-hidden="true">?</div>
    <div class="tooltip-text" role="tooltip">
      {text}
    </div>
  </div>
  
  <style>
    .tooltip-container {
      position: relative;
      display: inline-flex;
      margin-left: 6px; /* Adjusted margin */
      cursor: help;
    }
  
    /* This creates a small, circular, dependency-free info icon */
    .icon-replacement {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #4b5563; /* gray-600 */
      color: #d1d5db; /* gray-300 */
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
      user-select: none; /* Prevents text selection */
    }
  
    .tooltip-text {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s;
      
      width: 220px;
      background-color: #374151; /* gray-700 */
      color: #fff;
      text-align: center;
      font-weight: normal;
      border-radius: 6px;
      padding: 8px;
      
      position: absolute;
      z-index: 10;
      bottom: 150%; /* Increased distance from element */
      left: 50%;
      margin-left: -110px;
    }
  
    .tooltip-text::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #374151 transparent transparent transparent;
    }
  
    .tooltip-container:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  </style>
  