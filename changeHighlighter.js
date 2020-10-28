function main() {

  var output = document.getElementById('output');
  while (output.hasChildNodes()) {
      output.removeChild(output.lastChild);
  }

  var left = splitLines(document.getElementById('left').value);
  var right = splitLines(document.getElementById('right').value);

  console.log(left);
  console.log(right);

  var output = document.getElementById('output_holder');
  output_holder.style.display = 'block';

  var changes = findChanges(left, right);

  writeText(changes, 'output');
}

function splitLines(text) {
  return text.split(/\r*\n/);
}

function findChanges(left, right) {

  var left_holder = 0;
  var right_holder = 0;
  var right_runner = 0;
  var changes = [];

  if (left.length == 1 && left[0].length == 0) {
    while (right_holder < right.length) {
      changes.push(['added', right[right_holder]]);
      right_holder++;
    }
    return changes;
  } else if (right.length == 1 && right[0].length == 0) {
    while (left_holder < left.length) {
      changes.push(['deleted', left[left_holder]]);
      left_holder++;
    }
    return changes;
  } else {

    while (left_holder < left.length || right_holder < right.length) {

      if (left[left_holder] == right[right_runner]) {
        if (right_holder < right_runner) {
          while (right_holder < right_runner) {
            changes.push(['added', right[right_holder]]);
            right_holder++;
          }
        } else {
          right_holder++;
          // right_runner++;
        }
          changes.push(['same', left[left_holder]]);
          left_holder++;
          right_runner++;
          right_holder = right_runner;
      } else {
        right_runner++;
      }

      // if we don't find the string
      if (right_runner > right.length) {
        changes.push(['deleted', left[left_holder]]);
        left_holder++;
        right_runner = right_holder;
      }

      // if we get to the end of the left, the rest of the right is new
      if (left_holder > left.length) {
        changes.push(['added', right[right_holder]]);
        right_holder++;
      }

    }
    return changes;
  }
}

function writeText(changes ,outputId) {
  // TODO: the numbering is counting new lines as wellS
  var text;
  var i = 0;
  var j = 1;
  var output = document.getElementById(outputId);

  while (i < changes.length) {
    var nextP = document.createElement('span');
    switch(changes[i][0]) {
      case 'added':
        nextP.className = 'added output-code';
        text = document.createTextNode(' - ' + changes[i][1]);
        break;
      case 'deleted':
        nextP.className = 'deleted output-code';
        text = document.createTextNode(j+1 + '. ' + changes[i][1]);
        j++;
        break;
      default:
        nextP.className = 'unchanged output-code';
        text = document.createTextNode(j + '. ' + changes[i][1]);
        j++;
    }

    nextP.appendChild(text);
    output.appendChild(nextP);
    output.appendChild(document.createElement('br'))
    i = i + 1;
  }
}
