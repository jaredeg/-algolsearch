import '../css/app.scss';
import $ from 'jquery';
import 'bootstrap';
import 'waypoints';
import 'scrollTo';
import 'algoliasearch';

app({
    appId: 'P2GLY9C5UX',
    apiKey: '57f2f61db10f10c4eb26f0f024e1b7ba'
    indexName: 'devBESTBUY'
});


function app(agolSearch) {
  var search = instantsearch({
    appId: agolSearch.appId,
    apiKey: agolSearch.apiKey,
    indexName: agolSearch.indexName,
    urlSync: true
  });


$(document).ready(function() {
        var refinements = {};
        var $inputfield = $('#q');
        // Replace the following values by your ApplicationID and ApiKey.
        var client = algoliasearch('P2GLY9C5UX', '57f2f61db10f10c4eb26f0f024e1b7ba');
        // Replace the following value by the name of the index you want to query.
        var index = client.initIndex('dev_BESTBUY');
        $inputfield.keyup(function() {
          search();
        }).focus();
        window.toggleRefine = function(refinement) {
          refinements[refinement] = !refinements[refinement];
          search();
        };
        function search() {
          var filters = [];
          for (var refinement in refinements) {
            if (refinements[refinement]) {
              filters.push(refinement);
            }
          }
          index.search($inputfield.val(), {
            facets: '*', facetFilters: filters
          }, searchCallback);
        }
        function searchCallback(err, content) {
          if (err) {
            // error
            return;
          }
          if (content.query != $inputfield.val()) {
            // do not consider out-dated queries
            return;
          }
          if (content.hits.length == 0 || $.trim(content.query) === '') {
            // no results
            $('#hits').empty();
            $('#facets').empty();
            return;
          }
          // Scan all hits and display them
          var hits = '';
          for (var i = 0; i < content.hits.length; ++i) {
            var hit = content.hits[i];
            hits += '<div class="hit">';
            for (var attribute in hit._highlightResult) {
              hits += '<div class="attribute">' +
                '<span>' + attribute + ': </span>' +
                hit._highlightResult[attribute].value +
                '</div>';
            }
            hits += '</div>';
          }
          $('#hits').html(hits);
          // Scan all facets and display them
          var facets = '';
          for (var facet in content.facets) {
            facets += '<h4>' + facet + '</h4>';
            facets += '<ul>';
            var values = content.facets[facet];
            for (var value in values) {
              var refinement = facet + ':' + value;
              facets += '<li class="' + (refinements[refinement] ? 'refined' : '') + '">' +
                  '<a href="#" onclick="toggleRefine(\'' + refinement + '\'); return false">' + value + '</a> (' + values[value] + ')' +
                '</li>';
            }
            facets += '</ul>';
          }
          $('#facets').html(facets);
        }
      });
/**
 * EXAMPLE JS STARTS
 */
$(function() {
    $('[id^=scrollTo]').click(function() {
        var id = $(this).attr('id').slice(9);
        $(window).scrollTo($('#' + id), 1000, { offset: { top: -51, left: 0 } });
    });

    $('#marketing').waypoint(function() {
        $('.img-circle').addClass('animated zoomIn');
    }, {
        offset: '50%',
        triggerOnce: true
    });

    $('.featurette').waypoint(function() {
        $('#' + this.element.id + ' .featurette-image').addClass('animated pulse');
    }, {
        offset: '50%',
        triggerOnce: true
    });

     
});

     function searchCallback(content) {
        if (content.query !== $('#q').val()) {
          // do not take out-dated answers into account
          return;
        }
        if (content.hits.length === 0) {
          // no results
          $('#hits').empty();
          return;
        }
        // Scan all hits and display them
        var html = '';
        for (var i = 0; i < content.hits.length; ++i) {
          var hit = content.hits[i];
          html += '<div class="hit">';
          for (var attribute in hit._highlightResult) {
            html += '<div class="attribute">' +
              '<span>' + attribute + ': </span>' +
              hit._highlightResult[attribute].value +
              '</div>';
          }
          html += '</div>';
        }
        $('#hits').html(html);
      }
/**
 * EXAMPLE JS ENDS
 */
