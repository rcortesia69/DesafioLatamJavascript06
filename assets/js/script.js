const clpInput = document.querySelector("#clp-input");
        const monedaSelect = document.querySelector("#moneda-select");
        const buscarBtn = document.querySelector("#buscar-btn");
        const resultadoP = document.querySelector("#resultado");
        const errorP = document.querySelector("#error-mensaje");
        const chartCanvas = document.querySelector("#historial-chart");
        
        let myChart;

        async function convertirMoneda() {
            const clpAmount = clpInput.value;
            const monedaSeleccionada = monedaSelect.value;
            
            if (clpAmount === "") {
                alert("Por favor, ingresa un monto en CLP.");
                return;
            }

            try {
                errorP.textContent = ""; 
                const res = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}`);
                const data = await res.json();
                
                const valorMonedaActual = data.serie[0].valor;
                const conversion = (clpAmount / valorMonedaActual).toFixed(2);
                resultadoP.textContent = `Resultado: $${conversion}`;
                
                renderizarGrafico(data.serie);

            } catch (error) {
                resultadoP.textContent = "...";
                errorP.textContent = `Error: ${error.message}`;
            }
        }

        function renderizarGrafico(serieHistorial) {
            const ultimos10dias = serieHistorial.slice(0, 10).reverse();
            
            const labels = ultimos10dias.map(item => new Date(item.fecha).toLocaleDateString('es-CL'));
            const dataValues = ultimos10dias.map(item => item.valor);

            const config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Historial últimos 10 días (${monedaSelect.value})`,
                        backgroundColor: 'rgba(0, 191, 255, 0.2)',
                        borderColor: 'rgb(0, 191, 255)',
                        data: dataValues,
                    }]
                }
            };
            
            if (myChart) {
                myChart.destroy();
            }

            myChart = new Chart(chartCanvas, config);
        }
        
        buscarBtn.addEventListener("click", convertirMoneda);
