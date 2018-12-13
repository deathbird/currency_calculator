<?php
/**
 * Created by PhpStorm.
 * User: jdi
 * Date: 11/12/2018
 * Time: 9:41 μμ
 */

namespace App\Controller;

use App\Services\CurrenciesService;
use App\Services\RatesService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * Main application controller class, handles all actions - requests. Uses 2 services CurrenciesService and
 * CurrenciesService to retrieve and persist currencies and rates.
 *
 * @package App\Controller
 */
class MainController extends AbstractController
{
    /**
     * Homepage action, renders the only template of the application.
     *
     * @Route("/", name="app_homepage")
     */
    public function homepage(CurrenciesService $currenciesService, RatesService $ratesService)
    {
        return $this->render('homepage/homepage.html.twig', [
            'currencies' => json_encode($currenciesService->getCurrencies()),
            'rates' => json_encode($ratesService->getExchangeRates()),
        ]);
    }

    /**
     * Currency insert AJAX action.
     *
     * @Route("/currencies/insert", name="app_currency_insert_route", methods={"POST"})
     */
    public function currencyInsert(Request $request, CurrenciesService $currenciesService)
    {
        $data = json_decode($request->getContent(), true);
        if (isset($data['code']) && isset($data['description'])) {
            try {
                // sanitize req parameters
                $code = $this->sanitizeParameter($data['code']);
                $description = $this->sanitizeParameter($data['description']);
                $rv = $currenciesService->insert($code, $description);
                $error = $rv ? null : 'Insert failed!';
            } catch (\Exception $e) {
                $error = $e->getMessage();
            }
        } else {
            $error = 'Server validation failed!';
        }
        return $this->json(['result' => $currenciesService->getCurrencies(), 'error' => $error]);
    }

    /**
     * Rate insert AJAX action.
     *
     * @Route("/rates/insert", name="app_rates_insert_route", methods={"POST"})
     */
    public function ratesInsert(Request $request, RatesService $ratesService)
    {
        $data = json_decode($request->getContent(), true);
        if (isset($data['base']) && isset($data['target']) && isset($data['rate'])) {
            try {
                // sanitize req parameters
                $base = $this->sanitizeParameter($data['base']);
                $target = $this->sanitizeParameter($data['target']);
//                $rate = $this->sanitizeParameter((float)$data['rate'], FILTER_SANITIZE_NUMBER_FLOAT);
                $rate = (float)$data['rate'];
                $rv = $ratesService->insert($base, $target, $rate);
                $error = $rv ? null : 'Insert failed!';
            } catch (\Exception $e) {
                $error = $e->getMessage();
            }
        } else {
            $error = 'Server validation failed!';
        }
        return $this->json(['result' => $ratesService->getExchangeRates(), 'error' => $error]);
    }

    /**
     * Rate update AJAX action.
     *
     * @Route("/rates/update", name="app_rates_update_route", methods={"POST"})
     */
    public function ratesUpdate(Request $request, RatesService $ratesService)
    {
        $data = json_decode($request->getContent(), true);
        if (isset($data['base']) && isset($data['target']) && isset($data['rate'])) {
            try {
                // sanitize req parameters
                $base = $this->sanitizeParameter($data['base']);
                $target = $this->sanitizeParameter($data['target']);
//                $rate = $this->sanitizeParameter($data['rate'], FILTER_SANITIZE_NUMBER_FLOAT);
                $rate = (float)$data['rate'];
                $rv = $ratesService->update($base, $target, $rate);
                $error = $rv ? null : 'Update failed!';
            } catch (\Exception $e) {
                $error = $e->getMessage();
            }
        } else {
            $error = 'Server validation failed!';
        }
        return $this->json(['result' => $ratesService->getExchangeRates(), 'error' => $error]);
    }

    /**
     * Utility function to sanitize a request parameter.
     *
     * @param     $param
     * @param int $options
     *
     * @return mixed
     */
    private function sanitizeParameter($param, $options = FILTER_SANITIZE_STRING)
    {
        return filter_var($param, $options);
    }
}