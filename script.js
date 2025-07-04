
fetch("nd_adaptive_24traits_96questions.json")
  .then(response => response.json())
  .then(surveyDataRaw => {
    const container = document.getElementById('questionsContainer');
    const surveyData = [];

    surveyDataRaw.forEach((item, index) => {
      const block = document.createElement('div');
      block.className = 'question-block';

      const question = document.createElement('div');
      question.className = 'question-text';
      question.innerText = `${index + 1}. ${item.text}`;

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';

      item.options.forEach((opt, i) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = item.question_id;
        input.value = i + 1;
        input.required = true;
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + opt));
        optionsDiv.appendChild(label);
      });

      block.appendChild(question);
      block.appendChild(optionsDiv);
      container.appendChild(block);
      surveyData.push(item);
    });

    document.getElementById('surveyForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const results = {};

      for (const [key, value] of formData.entries()) {
        const question = surveyData.find(q => q.question_id === key);
        const trait = question.trait;
        if (!results[trait]) results[trait] = [];
        results[trait].push(parseInt(value));
      }

      const summary = Object.entries(results).map(([trait, scores]) => {
        const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        return { trait, avg: parseFloat(avg) };
      }).sort((a, b) => b.avg - a.avg);

      let resultHTML = `<h2>Your Top Strengths</h2><ol>`;
      summary.slice(0, 5).forEach(entry => {
        resultHTML += `<li><strong>${entry.trait}</strong> - Score: ${entry.avg}</li>`;
      });
      resultHTML += `</ol><h3>Full Breakdown</h3><ul>`;
      summary.forEach(entry => {
        resultHTML += `<li>${entry.trait}: ${entry.avg}</li>`;
      });
      resultHTML += `</ul>`;

      const resultDiv = document.getElementById('results');
      resultDiv.innerHTML = resultHTML;
      resultDiv.style.display = 'block';
      document.getElementById('downloadBtn').style.display = 'block';

      window.scrollTo({ top: resultDiv.offsetTop, behavior: 'smooth' });
      window.latestResults = summary;
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("ND-Adaptive Strengths Survey Results", 10, 10);
      doc.setFontSize(12);
      let y = 20;
      const summary = window.latestResults || [];
      summary.forEach(entry => {
        doc.text(`${entry.trait}: ${entry.avg}`, 10, y);
        y += 8;
      });
      doc.save("ND_Strengths_Results.pdf");
    });
  });
